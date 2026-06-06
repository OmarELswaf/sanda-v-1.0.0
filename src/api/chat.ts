import api, { USE_MOCKS } from "./client";
import { mockConversations, mockMessages } from "@/lib/mock/data";
import type { Conversation, Message } from "./types";

const delay = <T>(value: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(value), ms));

export const chatApi = {
  async conversations(): Promise<Conversation[]> {
    if (USE_MOCKS) return delay(mockConversations);
    const { data } = await api.get("/conversations");
    return data;
  },
  async messages(conversationId: string): Promise<Message[]> {
    if (USE_MOCKS) return delay(mockMessages[conversationId] ?? []);
    const { data } = await api.get(`/conversations/${conversationId}/messages`);
    return data;
  },
  async send(conversationId: string, message: string): Promise<Message> {
    if (USE_MOCKS) {
      return delay({
        id: "m" + Date.now(),
        conversationId,
        senderId: "u1",
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
    const { data } = await api.post(`/conversations/${conversationId}/messages`, { message });
    return data;
  },
};
