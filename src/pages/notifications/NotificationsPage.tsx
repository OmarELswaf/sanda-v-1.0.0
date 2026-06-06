import { useState, type ReactNode } from "react";
import { Bell, Check, Trash2, MessageSquare, Briefcase, Wallet, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import type { Notification } from "@/api/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const typeConfig: Record<string, { icon: ReactNode; label: string; color: string }> = {
  job: { icon: <Briefcase className="w-4 h-4" />, label: "وظائف", color: "bg-blue-100 text-blue-700" },
  application: { icon: <Briefcase className="w-4 h-4" />, label: "تقديمات", color: "bg-green-100 text-green-700" },
  message: { icon: <MessageSquare className="w-4 h-4" />, label: "رسائل", color: "bg-purple-100 text-purple-700" },
  payment: { icon: <Wallet className="w-4 h-4" />, label: "مدفوعات", color: "bg-emerald-100 text-emerald-700" },
  sos: { icon: <AlertTriangle className="w-4 h-4" />, label: "طوارئ", color: "bg-red-100 text-red-700" },
  system: { icon: <Info className="w-4 h-4" />, label: "نظام", color: "bg-gray-100 text-gray-700" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotif = useDeleteNotification();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">يرجى تسجيل الدخول لعرض الإشعارات</p>
      </div>
    );
  }

  const filteredNotifications = notifications?.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      markRead.mutate(notif.id);
    }
    if (notif.metadata?.jobId) {
      window.location.href = `/jobs/${notif.metadata.jobId}`;
    } else if (notif.metadata?.conversationId) {
      window.location.href = `/chat`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">الإشعارات</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "لا توجد إشعارات جديدة"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">
            الكل
            {notifications && (
              <Badge variant="secondary" className="mr-1 text-[10px]">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            غير مقروء
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mr-1 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="job">وظائف</TabsTrigger>
          <TabsTrigger value="application">تقديمات</TabsTrigger>
          <TabsTrigger value="message">رسائل</TabsTrigger>
          <TabsTrigger value="payment">مدفوعات</TabsTrigger>
          <TabsTrigger value="sos">طوارئ</TabsTrigger>
          <TabsTrigger value="system">نظام</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.system;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                      !notif.isRead
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card border-border"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        config.color
                      )}
                    >
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={cn(
                              "font-medium",
                              !notif.isRead && "text-foreground"
                            )}
                          >
                            {notif.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notif.body}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <span className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {config.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notif.createdAt).toLocaleDateString("ar-EG", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotif.mutate(notif.id);
                          }}
                          className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium text-muted-foreground">
                لا توجد إشعارات
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "unread"
                  ? "جميع الإشعارات مقروءة"
                  : filter === "all"
                  ? "ستظهر الإشعارات الجديدة هنا"
                  : "لا توجد إشعارات من هذا النوع"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}