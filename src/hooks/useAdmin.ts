import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";

export const useAdminStats = () =>
  useQuery({ queryKey: ["admin", "stats"], queryFn: () => adminApi.stats() });

export const useAdminUsers = () =>
  useQuery({ queryKey: ["admin", "users"], queryFn: () => adminApi.users() });

export const useAdminReports = () =>
  useQuery({ queryKey: ["admin", "reports"], queryFn: () => adminApi.reports() });
