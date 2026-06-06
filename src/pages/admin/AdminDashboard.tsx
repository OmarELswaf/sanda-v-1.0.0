import { Users, Briefcase, Wallet, Flag, TrendingUp, Activity } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "@/layouts/AdminLayout";
import { useAdminStats } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">لوحة التحكم</h1>
      <p className="text-muted-foreground mb-8">نظرة عامة على نشاط منصة سندة</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard icon={Users} label="مستخدمين" value={data.totalUsers} color="primary" />
          <StatCard icon={Briefcase} label="إجمالي الوظائف" value={data.totalJobs} color="primary" />
          <StatCard icon={Activity} label="وظائف نشطة" value={data.activeJobs} color="success" />
          <StatCard icon={Wallet} label="محجوز (Escrow)" value={`${data.heldAmount.toLocaleString()} ج`} color="warning" />
          <StatCard icon={Flag} label="بلاغات مفتوحة" value={data.openReports} color="destructive" />
          <StatCard icon={TrendingUp} label="وظائف اليوم" value={data.jobsToday} color="accent" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-bold mb-1">الأرباح الشهرية</h2>
          <p className="text-sm text-muted-foreground mb-4">الإيرادات الإجمالية بالجنيه</p>
          {data && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-bold mb-1">الوظائف حسب الفئة</h2>
          <p className="text-sm text-muted-foreground mb-4">توزيع الوظائف</p>
          {data && (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.jobsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const colorMap: Record<string, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  accent: "bg-accent/10 text-accent",
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-heading font-extrabold text-xl">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
