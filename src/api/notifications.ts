import api, { USE_MOCKS } from "./client";
import type { Notification, ApiSuccessResponse } from "./types";

const delay = <T>(value: T, ms = 300) =>
  new Promise<T>((r) => setTimeout(() => r(value), ms));

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "u1",
    title: "تم قبولك في وظيفة",
    body: "تم قبولك للعمل كمساعد مطبخ في مطعم البيت السوري.",
    type: "application",
    isRead: false,
    createdAt: "2026-06-06T10:00:00",
    metadata: { jobId: "j4", applicationId: "a3" },
  },
  {
    id: "n2",
    userId: "u1",
    title: "رسالة جديدة",
    body: "مطعم البيت السوري: أهلًا أحمد، يومك ابتدا بكرة من ٥م.",
    type: "message",
    isRead: true,
    createdAt: "2026-06-06T09:30:00",
    metadata: { conversationId: "c1", senderId: "u5" },
  },
  {
    id: "n3",
    userId: "u1",
    title: "تم تحرير مبلغ من Escrow",
    body: "تم تحويل ٢٥٠ جنيه إلى رصيدك المتاح.",
    type: "payment",
    isRead: false,
    createdAt: "2026-06-05T18:00:00",
    metadata: { transactionId: "t1", amount: 250 },
  },
  {
    id: "n4",
    userId: "u1",
    title: "وظيفة طارئة قريبة!",
    body: "وظيفة نادل مطلوبة الآن في التجمع الخامس — ٦٠٠ جنيه.",
    type: "sos",
    isRead: false,
    createdAt: "2026-06-06T14:00:00",
    metadata: { jobId: "j1", distance: "2.5km" },
  },
  {
    id: "n5",
    userId: "u2",
    title: "متقدم جديد",
    body: "أحمد المصري تقدم على وظيفة تركيب أثاث ايكيا.",
    type: "job",
    isRead: false,
    createdAt: "2026-06-04T11:00:00",
    metadata: { jobId: "j2", applicationId: "a1" },
  },
];

export const notificationsApi = {
  /** List all notifications for the current user */
  async list(): Promise<Notification[]> {
    if (USE_MOCKS) {
      return delay(mockNotifications.filter((n) => n.userId === "u1"));
    }
    const { data } = await api.get<Notification[]>("/notifications");
    return data;
  },

  /** Get unread count */
  async unreadCount(): Promise<{ count: number }> {
    if (USE_MOCKS) {
      const count = mockNotifications.filter((n) => !n.isRead).length;
      return delay({ count });
    }
    const { data } = await api.get<{ count: number }>("/notifications/unread-count");
    return data;
  },

  /** Mark a single notification as read */
  async markRead(id: string): Promise<ApiSuccessResponse> {
    if (USE_MOCKS) {
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.isRead = true;
      return delay({ ok: true });
    }
    const { data } = await api.patch<ApiSuccessResponse>(`/notifications/${id}/read`);
    return data;
  },

  /** Mark all notifications as read */
  async markAllRead(): Promise<ApiSuccessResponse> {
    if (USE_MOCKS) {
      mockNotifications.forEach((n) => (n.isRead = true));
      return delay({ ok: true });
    }
    const { data } = await api.patch<ApiSuccessResponse>("/notifications/read-all");
    return data;
  },

  /** Delete a notification */
  async delete(id: string): Promise<ApiSuccessResponse> {
    if (USE_MOCKS) {
      const idx = mockNotifications.findIndex((n) => n.id === id);
      if (idx > -1) mockNotifications.splice(idx, 1);
      return delay({ ok: true });
    }
    const { data } = await api.delete<ApiSuccessResponse>(`/notifications/${id}`);
    return data;
  },
};