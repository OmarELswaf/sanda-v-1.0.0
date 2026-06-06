import api, { USE_MOCKS } from "./client";
import { mockTransactions } from "@/lib/mock/data";
import type { WalletTransaction } from "./types";

const delay = <T>(value: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(value), ms));

export const walletApi = {
  async transactions(): Promise<WalletTransaction[]> {
    if (USE_MOCKS) return delay(mockTransactions);
    const { data } = await api.get("/wallet/transactions");
    return data;
  },
  async balance(): Promise<{ available: number; held: number }> {
    if (USE_MOCKS) return delay({ available: 1250, held: 600 });
    const { data } = await api.get("/wallet/balance");
    return data;
  },
  async withdraw(amount: number): Promise<{ ok: true }> {
    if (USE_MOCKS) return delay({ ok: true });
    const { data } = await api.post("/wallet/withdraw", { amount });
    return data;
  },
};
