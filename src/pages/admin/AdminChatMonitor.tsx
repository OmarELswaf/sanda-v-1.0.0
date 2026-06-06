import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MessageCircle, Eye, ShieldAlert, Clock, FileDown } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockConversations, mockMessages, mockUsers } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const SENTINEL_TERMS = [
  "فيزا",
  "حساب بنكي",
  "رقم الكارت",
  "تحويل خارج المنصة",
  "whatsapp",
  "واتساب",
  "010",
  "كلمة سر",
  "ادفع قبل",
  "تحويلات بنكية",
];

export default function AdminChatMonitor() {
  const [query, setQuery] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(mockConversations[0]?.id ?? null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build conversation list enriched with message counts + flag count
  const enriched = useMemo(() => {
    return mockConversations.map((c) => {
      const msgs = mockMessages[c.id] ?? [];
      const flagged = msgs.filter((m) =>
        SENTINEL_TERMS.some((t) => m.message.toLowerCase().includes(t.toLowerCase()))
      );
      const user1 = mockUsers.find((u) => u.id === c.participant.id);
      return { ...c, messages: msgs, flagged, participant: { ...c.participant, role: user1?.role } };
    });
  }, []);

  const filtered = useMemo(() => {
    return enriched.filter((c) => {
      const matchQ =
        !query ||
        c.participant.name.includes(query) ||
        c.jobTitle.includes(query) ||
        c.messages.some((m) => m.message.includes(query));
      const matchF = !flaggedOnly || c.flagged.length > 0;
      return matchQ && matchF;
    });
  }, [enriched, query, flaggedOnly]);

  const active = filtered.find((c) => c.id === activeId) ?? filtered[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.id, active?.messages.length]);

  const totalFlagged = enriched.reduce((sum, c) => sum + c.flagged.length, 0);
  const totalMessages = enriched.reduce((sum, c) => sum + c.messages.length, 0);

  const handleExport = () => {
    if (!active) return;
    const csv = [
      ["timestamp", "senderId", "message", "flagged"].join(","),
      ...active.messages.map((m) => {
        const isFlag = SENTINEL_TERMS.some((t) => m.message.toLowerCase().includes(t.toLowerCase()));
        return [m.createdAt, m.senderId, `"${m.message.replace(/"/g, '""')}"`, isFlag].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${active.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <h1 className="font-heading font-extrabold text-3xl mb-2">مراقبة المحادثات</h1>
      <p className="text-muted-foreground mb-6">
        مراجعة محتوى المحادثات لضمان الامتثال لقواعد المنصة
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <KpiBox icon={MessageCircle} label="محادثات نشطة" value={enriched.length} cls="bg-primary/10 text-primary" />
        <KpiBox icon={Eye} label="إجمالي الرسائل" value={totalMessages} cls="bg-accent/10 text-accent" />
        <KpiBox icon={ShieldAlert} label="رسائل تم الإبلاغ عنها" value={totalFlagged} cls="bg-destructive/10 text-destructive" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden grid md:grid-cols-[300px_1fr] h-[65vh]">
        {/* Conversation list */}
        <div className="border-l border-border overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المحادثات..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant={flaggedOnly ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFlaggedOnly((v) => !v)}
              className="w-full"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {flaggedOnly ? "عرض الكل" : "المحادثات المبلّغة فقط"}
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              مفيش محادثات.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "text-right p-3 border-b border-border hover:bg-muted/30 transition flex gap-3 items-start",
                  active?.id === c.id && "bg-primary-soft"
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={c.participant.avatar} />
                  <AvatarFallback>{c.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-sm truncate">{c.participant.name}</span>
                    {c.flagged.length > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        {c.flagged.length}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-primary truncate">{c.jobTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.lastMessage}</div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Conversation view */}
        <div className="flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={active.participant.avatar} />
                  <AvatarFallback>{active.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{active.participant.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{active.jobTitle}</div>
                </div>
                <div className="flex items-center gap-2">
                  {active.flagged.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <ShieldAlert className="h-3 w-3 me-1" />
                      {active.flagged.length} رسالة مشبوهة
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <FileDown className="h-3.5 w-3.5" /> CSV
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                {active.messages.map((m) => {
                  const flagged = SENTINEL_TERMS.some((t) => m.message.toLowerCase().includes(t.toLowerCase()));
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[80%] bg-card border",
                        flagged && "border-destructive/50 bg-destructive/5"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {m.senderId === "u1" ? "أحمد (مرسل)" : active.participant.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          <Clock className="inline h-3 w-3 me-0.5" />
                          {new Date(m.createdAt).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </div>
                      <div className="text-sm">{m.message}</div>
                      {flagged && (
                        <Badge variant="destructive" className="mt-2 text-[10px]">
                          كلمات مشبوهة: مشاركة بيانات حساسة
                        </Badge>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground text-center">
                وضع المراقبة — لا تقدر ترسل رسائل من هنا.
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function KpiBox({ icon: Icon, label, value, cls }: { icon: any; label: string; value: number; cls: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cls)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-heading font-extrabold text-xl">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
