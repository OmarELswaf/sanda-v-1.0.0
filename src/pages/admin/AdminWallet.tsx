import { useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Search, Download, Filter, ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle2, type LucideIcon } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTransactions, mockUsers } from "@/lib/mock/data";
import type { TransactionType } from "@/api/types";

const typeMeta: Record<TransactionType, { label: string; cls: string; sign: string }> = {
  hold: { label: "محجوز", cls: "text-warning", sign: "" },
  release: { label: "تحرير", cls: "text-success", sign: "+" },
  withdraw: { label: "سحب", cls: "text-destructive", sign: "-" },
  deposit: { label: "إيداع", cls: "text-success", sign: "+" },
  refund: { label: "استرداد", cls: "text-success", sign: "+" },
};

const TYPE_OPTIONS: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "كل العمليات" },
  { value: "hold", label: "محجوز" },
  { value: "release", label: "تحرير" },
  { value: "withdraw", label: "سحب" },
  { value: "deposit", label: "إيداع" },
  { value: "refund", label: "استرداد" },
];

export default function AdminWallet() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TransactionType | "all">("all");
  const [isLoading] = useState(false);

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchT = type === "all" || t.transactionType === type;
      const job = t.jobId ? mockUsers.find((u) => u.id === t.walletId) : null;
      const matchQ =
        !query ||
        t.id.includes(query) ||
        (t.jobTitle ?? "").includes(query) ||
        (job?.name ?? "").includes(query);
      return matchT && matchQ;
    });
  }, [query, type]);

  // Summary
  const summary = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    let held = 0;
    for (const t of mockTransactions) {
      if (t.transactionType === "release" || t.transactionType === "deposit" || t.transactionType === "refund") {
        totalIn += t.amount;
      } else if (t.transactionType === "withdraw") {
        totalOut += t.amount;
      } else if (t.transactionType === "hold") {
        held += t.amount;
      }
    }
    return { totalIn, totalOut, held };
  }, []);

  const handleExport = () => {
    const rows = [
      ["id", "amount", "type", "status", "createdAt", "jobTitle"].join(","),
      ...filtered.map((t) => [t.id, t.amount, t.transactionType, t.paymentStatus, t.createdAt, `"${t.jobTitle ?? ""}"`].join(",")),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanda-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">إدارة المحفظة</h1>
      <p className="text-muted-foreground mb-6">المدفوعات، الضمان، وسجل المعاملات المالية</p>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <KpiCard
          icon={TrendingUp}
          label="إجمالي الداخل"
          value={`${summary.totalIn.toLocaleString()} ج`}
          cls="bg-success/10 text-success"
        />
        <KpiCard
          icon={TrendingDown}
          label="إجمالي الخارج"
          value={`${summary.totalOut.toLocaleString()} ج`}
          cls="bg-destructive/10 text-destructive"
        />
        <KpiCard
          icon={Wallet}
          label="مبالغ محجوزة (Escrow)"
          value={`${summary.held.toLocaleString()} ج`}
          cls="bg-warning/10 text-warning"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> تصفية العمليات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-[1fr_220px_auto] gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث برقم العملية، الوظيفة، أو اسم المستخدم..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType | "all")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" /> تصدير CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-6">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              مفيش عمليات مطابقة.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-right">
                  <tr>
                    <th className="px-4 py-3 font-semibold">رقم</th>
                    <th className="px-4 py-3 font-semibold">المستخدم</th>
                    <th className="px-4 py-3 font-semibold">الوظيفة</th>
                    <th className="px-4 py-3 font-semibold">النوع</th>
                    <th className="px-4 py-3 font-semibold">المبلغ</th>
                    <th className="px-4 py-3 font-semibold">الحالة</th>
                    <th className="px-4 py-3 font-semibold">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => {
                    const m = typeMeta[t.transactionType];
                    const user = mockUsers.find((u) => u.id === t.walletId);
                    return (
                      <tr key={t.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                        <td className="px-4 py-3">{user?.name ?? "—"}</td>
                        <td className="px-4 py-3">{t.jobTitle ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1">
                            {t.transactionType === "withdraw" ? <ArrowDownToLine className="h-3 w-3" /> :
                             t.transactionType === "deposit" ? <ArrowUpFromLine className="h-3 w-3" /> :
                             t.transactionType === "hold" ? <Clock className="h-3 w-3" /> :
                             <CheckCircle2 className="h-3 w-3" />}
                            {m.label}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-semibold ${m.cls}`}>
                          {m.sign}{t.amount} ج
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={t.paymentStatus === "completed" ? "bg-success/10 text-success border-success/20" : t.paymentStatus === "pending" ? "bg-warning/10 text-warning border-warning/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                            {t.paymentStatus === "completed" ? "مكتمل" : t.paymentStatus === "pending" ? "قيد المعالجة" : "فشل"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString("ar-EG", { dateStyle: "short" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function KpiCard({ icon: Icon, label, value, cls }: { icon: LucideIcon; label: string; value: string; cls: string }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cls}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-heading font-extrabold text-2xl">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
