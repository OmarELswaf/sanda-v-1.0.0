import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, MapPin, SlidersHorizontal } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import JobCard from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const cities = ["all", "القاهرة", "الجيزة", "الإسكندرية", "المنصورة"];
const categories = ["all", "ضيافة وفعاليات", "تنظيف", "صيانة وتركيبات", "مطاعم", "تسويق ميداني", "تصوير"];

const PAGE_SIZE = 6;

/**
 * Build a compact list of page tokens to render.
 * For <= MAX_VISIBLE pages, show every page.
 * Otherwise show: 1, …, (current-1, current, current+1), …, last
 */
function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  const MAX_VISIBLE = 7;
  if (total <= MAX_VISIBLE) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

export default function JobsFeed() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: jobs, isLoading } = useJobs({ q: q || undefined, city, category });

  const totalJobs = jobs?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [q, city, category]);

  // Clamp page if results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Scroll to top of page whenever the current page changes.
  // Respect prefers-reduced-motion for users who opt out of animation.
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // requestAnimationFrame ensures the new page content is committed
    // before we scroll, preventing a brief flash of the previous position.
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [safePage]);

  const visibleJobs = useMemo(() => {
    if (!jobs) return [];
    const start = (safePage - 1) * PAGE_SIZE;
    return jobs.slice(start, start + PAGE_SIZE);
  }, [jobs, safePage]);

  const pageItems = useMemo(() => buildPageItems(safePage, totalPages), [safePage, totalPages]);

  const startIndex = totalJobs === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, totalJobs);

  const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages || next === safePage) return;
    setPage(next);
  };

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
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="font-heading font-bold text-lg">
            {isLoading ? "جاري التحميل..." : `${totalJobs} وظيفة`}
          </h2>
          {!isLoading && totalJobs > 0 && (
            <p className="text-sm text-muted-foreground">
              عرض {startIndex}–{endIndex} من {totalJobs}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : visibleJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleJobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            لا توجد وظائف تطابق بحثك.
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <nav
            role="navigation"
            aria-label="ترقيم الصفحات"
            className="mt-10 flex justify-center"
          >
            <ul className="flex flex-row items-center gap-1">
              <li>
                <button
                  type="button"
                  aria-label="الصفحة السابقة"
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage === 1}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "default" }),
                    "gap-1 ps-2.5 pe-3 h-11",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {/* In RTL, "previous" is to the right; ChevronRight points that way */}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  <span>السابق</span>
                </button>
              </li>

              {pageItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <li key={`e-${idx}`} aria-hidden="true">
                    <span className="flex h-11 w-11 items-center justify-center text-muted-foreground">
                      …
                    </span>
                  </li>
                ) : (
                  <li key={item}>
                    <button
                      type="button"
                      aria-label={`الصفحة ${item}`}
                      aria-current={item === safePage ? "page" : undefined}
                      onClick={() => handlePageChange(item)}
                      className={cn(
                        buttonVariants({
                          variant: item === safePage ? "outline" : "ghost",
                          size: "icon",
                        }),
                        "h-11 w-11",
                      )}
                    >
                      {item}
                    </button>
                  </li>
                ),
              )}

              <li>
                <button
                  type="button"
                  aria-label="الصفحة التالية"
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage === totalPages}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "default" }),
                    "gap-1 pe-2.5 ps-3 h-11",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <span>التالي</span>
                  {/* In RTL, "next" is to the left; ChevronLeft points that way */}
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </MainLayout>
  );
}
