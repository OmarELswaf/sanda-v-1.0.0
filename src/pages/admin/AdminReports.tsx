import { Eye, MessageCircle } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { useAdminReports } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusMeta: Record<string, { label: string; cls: string }> = {
  open: { label: "مفتوح", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  reviewed: { label: "تحت المراجعة", cls: "bg-warning/10 text-warning border-warning/20" },
  closed: { label: "مغلق", cls: "bg-success/10 text-success border-success/20" },
};

export default function AdminReports() {
  const { data: reports, isLoading } = useAdminReports();

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">البلاغات والنزاعات</h1>
      <p className="text-muted-foreground mb-6">{reports?.length ?? 0} بلاغ</p>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {reports?.map((r) => {
            const s = statusMeta[r.status];
            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold">شكوى ضد: {r.reportedUser.name}</div>
                    <div className="text-xs text-muted-foreground">
                      من: {r.reportedBy.name} — {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                  <Badge variant="outline" className={s.cls}>{s.label}</Badge>
                </div>
                <p className="bg-muted/50 rounded-lg p-3 text-sm mb-3">{r.reason}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4" /> عرض التفاصيل</Button>
                  {r.jobId && <Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4" /> الاطلاع على المحادثة</Button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
