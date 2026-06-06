import { Ban, ShieldCheck, Star } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roleLabel: Record<string, string> = { worker: "عامل", employer: "صاحب عمل", admin: "مسؤول" };

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">إدارة المستخدمين</h1>
      <p className="text-muted-foreground mb-6">{users?.length ?? 0} مستخدم على المنصة</p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الرصيد</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-end">إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.city ?? "—"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{roleLabel[u.role]}</Badge></TableCell>
                  <TableCell className="font-mono text-sm">{u.phone}</TableCell>
                  <TableCell>
                    {u.rating ? <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {u.rating.toFixed(1)}</span> : "—"}
                  </TableCell>
                  <TableCell>{u.walletBalance.toLocaleString()} ج</TableCell>
                  <TableCell>
                    {u.isVerified ? (
                      <Badge className="bg-success/10 text-success border-success/20"><ShieldCheck className="h-3 w-3 me-1" /> موثق</Badge>
                    ) : (
                      <Badge variant="outline">غير موثق</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Ban className="h-4 w-4" /> حظر
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
}
