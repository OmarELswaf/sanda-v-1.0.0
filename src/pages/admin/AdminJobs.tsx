import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Users, ExternalLink, Filter } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobs } from "@/lib/mock/data";
import type { Job, JobStatus } from "@/api/types";

const STATUS_OPTIONS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "open", label: "مفتوحة" },
  { value: "in-progress", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتملة" },
  { value: "cancelled", label: "ملغاة" },
];

const statusMeta: Record<JobStatus, { label: string; cls: string }> = {
  open: { label: "مفتوحة", cls: "bg-success/10 text-success border-success/20" },
  "in-progress": { label: "قيد التنفيذ", cls: "bg-warning/10 text-warning border-warning/20" },
  completed: { label: "مكتملة", cls: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "ملغاة", cls: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function AdminJobs() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => {
      const matchQ =
        !query ||
        j.title.includes(query) ||
        j.city.includes(query) ||
        j.category.includes(query) ||
        j.employer.name.includes(query);
      const matchS = status === "all" || j.status === status;
      return matchQ && matchS;
    });
  }, [query, status]);

  // Group by status for the dashboard summary
  const byStatus = useMemo(() => {
    const acc: Record<JobStatus, number> = { open: 0, "in-progress": 0, completed: 0, cancelled: 0 };
    for (const j of mockJobs) acc[j.status]++;
    return acc;
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">إدارة الوظائف</h1>
      <p className="text-muted-foreground mb-6">{filtered.length} وظيفة</p>

      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {(["open", "in-progress", "completed", "cancelled"] as JobStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(status === s ? "all" : s)}
            className={`text-right bg-card border rounded-xl p-4 transition-all hover:border-primary/40 ${
              status === s ? "border-primary" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className={statusMeta[s].cls}>
                {statusMeta[s].label}
              </Badge>
            </div>
            <div className="font-heading font-extrabold text-2xl">{byStatus[s]}</div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> تصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-[1fr_220px] gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالعنوان، المدينة، الفئة، أو اسم صاحب العمل..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as JobStatus | "all")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              مفيش وظائف مطابقة للبحث.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-right">
                  <tr>
                    <th className="px-4 py-3 font-semibold">الوظيفة</th>
                    <th className="px-4 py-3 font-semibold">صاحب العمل</th>
                    <th className="px-4 py-3 font-semibold">المدينة</th>
                    <th className="px-4 py-3 font-semibold">السعر</th>
                    <th className="px-4 py-3 font-semibold">المتقدمين</th>
                    <th className="px-4 py-3 font-semibold">الحالة</th>
                    <th className="px-4 py-3 font-semibold">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((j: Job) => (
                    <tr key={j.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{j.title}</div>
                        <div className="text-xs text-muted-foreground">{j.category}</div>
                      </td>
                      <td className="px-4 py-3">{j.employer.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {j.city}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{j.price} ج</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" /> {j.applicantsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statusMeta[j.status].cls}>
                          {statusMeta[j.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/jobs/${j.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" /> فتح
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
