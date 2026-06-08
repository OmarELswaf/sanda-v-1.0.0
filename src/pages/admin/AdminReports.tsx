import { useState, useCallback } from "react";
import { Eye, XCircle, CheckCircle, Trash2 } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { useReportsQuery, useUpdateReportStatus, useDeleteReport } from "@/hooks/useAdminQueries";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Search } from "@/components/admin/Search";
import { FilterBar } from "@/components/admin/FilterBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/admin/Modal";
import { ErrorState } from "@/components/admin/ErrorState";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Report } from "@/api/types";

const statusMeta: Record<string, { label: string; className: string }> = {
  open: { label: "مفتوح", className: "bg-destructive/10 text-destructive border-destructive/20" },
  reviewed: { label: "تمت المراجعة", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  closed: { label: "مغلق", className: "bg-success/10 text-success border-success/20" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? statusMeta.open;
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}

export default function AdminReports() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const { data: response, isLoading, isError, error, refetch } = useReportsQuery({
    page,
    pageSize,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const reports = response?.data ?? [];
  const total = response?.total ?? 0;
  const serverPage = response?.page ?? 1;
  const serverPageSize = response?.pageSize ?? 10;

  const updateStatus = useUpdateReportStatus();
  const deleteReport = useDeleteReport();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: string | string[]) => {
    setStatusFilter(value as string);
    setPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setStatusFilter("");
    setSearch("");
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleResolve = useCallback(
    (report: Report) => {
      updateStatus.mutateAsync({ id: report.id, status: "reviewed" });
    },
    [updateStatus],
  );

  const handleClose = useCallback(
    (report: Report) => {
      updateStatus.mutateAsync({ id: report.id, status: "closed" });
    },
    [updateStatus],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteReport.mutateAsync(deleteTarget.id).then(() => setDeleteTarget(null));
  }, [deleteTarget, deleteReport]);

  if (isError) {
    return (
      <AdminLayout>
        <ErrorState
          title="خطأ في تحميل البلاغات"
          message={(error as Error)?.message || "حدث خطأ أثناء تحميل البيانات"}
          onRetry={() => refetch()}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h1 className="font-heading font-extrabold text-3xl">البلاغات والنزاعات</h1>
        <p className="text-muted-foreground">{total} بلاغ</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <Search
          placeholder="بحث عن سبب البلاغ..."
          onSearch={handleSearch}
          defaultValue={search}
        />
        <FilterBar
          filters={[
            {
              key: "status",
              label: "الحالة",
              type: "select",
              options: [
                { value: "open", label: "مفتوح" },
                { value: "reviewed", label: "تمت المراجعة" },
                { value: "closed", label: "مغلق" },
              ],
              value: statusFilter,
              onChange: handleStatusFilter,
            },
          ]}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <>
            <AdminDataTable<Report>
              data={reports}
              columns={[
                {
                  key: "reporter",
                  header: "المبلغ",
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {r.reportedBy?.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium">{r.reportedBy?.name || "غير معروف"}</span>
                    </div>
                  ),
                },
                {
                  key: "reportedUser",
                  header: "المُبلغ عنه",
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {r.reportedUser?.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium">{r.reportedUser?.name || "غير معروف"}</span>
                    </div>
                  ),
                },
                {
                  key: "reason",
                  header: "السبب",
                  className: "max-w-[200px]",
                  render: (r) => (
                    <span className="text-sm text-muted-foreground truncate block">{r.reason}</span>
                  ),
                },
                {
                  key: "status",
                  header: "الحالة",
                  render: (r) => <StatusBadge status={r.status} />,
                },
                {
                  key: "date",
                  header: "التاريخ",
                  render: (r) => (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  ),
                },
              ]}
              actions={(r) => (
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedReport(r)}
                    aria-label="عرض التفاصيل"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {r.status === "open" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                      onClick={() => handleResolve(r)}
                      disabled={updateStatus.isPending}
                      aria-label="تعيين كتمت المراجعة"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {r.status !== "closed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-success hover:text-success hover:bg-success/10"
                      onClick={() => handleClose(r)}
                      disabled={updateStatus.isPending}
                      aria-label="إغلاق البلاغ"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(r)}
                    aria-label="حذف البلاغ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />

            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / pageSize) || 1}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      <Modal
        open={!!selectedReport}
        onOpenChange={(open) => { if (!open) setSelectedReport(null); }}
        title="تفاصيل البلاغ"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">المُبلغ</p>
                <p className="font-semibold">{selectedReport.reportedBy?.name || "غير معروف"}</p>
                <p className="text-xs text-muted-foreground mt-1">المعرف: {selectedReport.reportedById}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">المُبلغ عنه</p>
                <p className="font-semibold">{selectedReport.reportedUser?.name || "غير معروف"}</p>
                <p className="text-xs text-muted-foreground mt-1">المعرف: {selectedReport.reportedUserId}</p>
              </div>
            </div>

            {selectedReport.job && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">الوظيفة المرتبطة</p>
                <p className="font-semibold">{selectedReport.job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedReport.job.city} — {selectedReport.job.price.toLocaleString()} ج
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-1">سبب البلاغ</p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                {selectedReport.reason}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">الحالة:</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(selectedReport.createdAt).toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="تأكيد حذف البلاغ"
        description={`هل أنت متأكد من حذف هذا البلاغ؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        loading={deleteReport.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  );
}
