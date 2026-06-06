import api, { USE_MOCKS } from "./client";
import { mockReports, mockStats, mockUsers } from "@/lib/mock/data";
import type { AdminStats, Report, User } from "./types";

const delay = <T>(value: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(value), ms));

export const adminApi = {
  async stats(): Promise<AdminStats> {
    if (USE_MOCKS) return delay(mockStats);
    const { data } = await api.get("/admin/stats");
    return data;
  },
  async users(): Promise<User[]> {
    if (USE_MOCKS) return delay(mockUsers);
    const { data } = await api.get("/admin/users");
    return data;
  },
  async reports(): Promise<Report[]> {
    if (USE_MOCKS) return delay(mockReports);
    const { data } = await api.get("/admin/reports");
    return data;
  },
  async banUser(userId: string): Promise<{ ok: true }> {
    if (USE_MOCKS) return delay({ ok: true });
    const { data } = await api.post(`/admin/users/${userId}/ban`);
    return data;
  },
};
