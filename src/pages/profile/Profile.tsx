import { useParams } from "react-router-dom";
import { MapPin, ShieldCheck, Calendar, Star, Briefcase } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { mockUsers } from "@/lib/mock/data";
import { useRatings } from "@/hooks/useJobs";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const user = mockUsers.find((u) => u.id === id) ?? mockUsers[0];
  const { data: ratings } = useRatings(user.id);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-heading font-extrabold text-2xl md:text-3xl">{user.name}</h1>
                {user.isVerified && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <ShieldCheck className="h-3 w-3 me-1" /> موثق
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground mb-3">
                {user.role === "worker" ? "عامل" : user.role === "employer" ? "صاحب عمل" : "مسؤول"}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {user.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.city}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> عضو منذ {new Date(user.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}</span>
                {user.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {user.rating.toFixed(1)} ({user.ratingsCount} تقييم)
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline">مراسلة</Button>
          </div>

          {user.bio && <p className="text-foreground/80 mt-6 pt-6 border-t border-border leading-relaxed">{user.bio}</p>}
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> المهارات</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => <Badge key={s} variant="outline" className="px-3 py-1">{s}</Badge>)}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatBox label="وظائف منفّذة" value="32" />
          <StatBox label="معدل الالتزام" value="98%" />
          <StatBox label="التقييم" value={user.rating?.toFixed(1) ?? "—"} />
        </div>

        {/* Ratings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg mb-4">آراء العملاء ({ratings?.length ?? 0})</h2>
          <div className="space-y-5">
            {ratings?.map((r) => (
              <div key={r.id} className="flex gap-3 pb-5 border-b border-border last:border-0 last:pb-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={r.reviewer.avatar} />
                  <AvatarFallback>{r.reviewer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{r.reviewer.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                  </div>
                  <StarRating value={r.rating} />
                  <p className="text-sm text-foreground/80 mt-2">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="font-heading font-extrabold text-2xl text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
