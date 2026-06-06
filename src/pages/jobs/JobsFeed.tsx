import { useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import JobCard from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const cities = ["all", "القاهرة", "الجيزة", "الإسكندرية", "المنصورة"];
const categories = ["all", "ضيافة وفعاليات", "تنظيف", "صيانة وتركيبات", "مطاعم", "تسويق ميداني", "تصوير"];

export default function JobsFeed() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const { data: jobs, isLoading } = useJobs({ q: q || undefined, city, category });

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-primary to-primary-deep text-primary-foreground py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl mb-2">الوظائف المتاحة</h1>
          <p className="text-primary-foreground/80 mb-6">اعثر على وظيفتك المناسبة بين أكثر من 400 وظيفة بارت-تايم</p>

          <div className="bg-card text-foreground rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 relative">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن وظيفة (مثل: نادل، تنظيف...)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="ps-4 pe-10 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="md:w-48 h-11 border-0">
                <MapPin className="h-4 w-4 me-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c === "all" ? "كل المدن" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-56 h-11 border-0">
                <SlidersHorizontal className="h-4 w-4 me-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c === "all" ? "كل الفئات" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="lg" className="h-11">بحث</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg">
            {isLoading ? "جاري التحميل..." : `${jobs?.length ?? 0} وظيفة`}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            لا توجد وظائف تطابق بحثك.
          </div>
        )}
      </section>
    </MainLayout>
  );
}
