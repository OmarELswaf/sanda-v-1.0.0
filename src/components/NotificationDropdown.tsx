import { Bell, Check, Trash2, MessageSquare, Briefcase, Wallet, AlertTriangle, Info } from "lucide-react";
import type { Notification } from "@/api/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const typeConfig: Record<string, { icon: ReactNode; label: string; color: string }> = {
  job: { icon: <Briefcase className="w-4 h-4" />, label: "وظائف", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  application: { icon: <Briefcase className="w-4 h-4" />, label: "تقديمات", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  message: { icon: <MessageSquare className="w-4 h-4" />, label: "رسائل", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  payment: { icon: <Wallet className="w-4 h-4" />, label: "مدفوعات", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  sos: { icon: <AlertTriangle className="w-4 h-4" />, label: "طوارئ", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  system: { icon: <Info className="w-4 h-4" />, label: "نظام", color: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300" },
};

interface NotificationDropdownProps {
  notifications?: Notification[];
  isLoading: boolean;
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  isLoading,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClose,
}: NotificationDropdownProps) {
  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      onMarkRead(notif.id);
    }
    // Navigate based on notification type
    if (notif.metadata?.jobId) {
      window.location.href = `/jobs/${notif.metadata.jobId}`;
    } else if (notif.metadata?.conversationId) {
      window.location.href = `/chat`;
    }
    onClose();
  };

  return (
    <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto top-16 sm:top-auto sm:left-0 sm:mt-2 w-auto sm:w-96 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <h3 className="font-semibold text-sm">الإشعارات</h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            جاري التحميل...
          </div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.system;
            return (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={cn(
                "flex items-start gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors border-b last:border-b-0 group",
                !notif.isRead
                  ? "bg-blue-50/70 dark:bg-blue-950/20"
                  : "bg-popover"
              )}
            >
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", config.color)}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold", !notif.isRead ? "text-foreground" : "text-foreground/80")}>
                  {notif.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {notif.body}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(notif.createdAt).toLocaleDateString("ar-EG", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notif.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-opacity"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-muted/30 text-center">
        <a
          href="/notifications"
          className="text-xs text-primary hover:underline"
          onClick={onClose}
        >
          عرض كل الإشعارات
        </a>
      </div>
    </div>
  );
}
