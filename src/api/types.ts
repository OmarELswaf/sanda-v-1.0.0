export type UserRole = "worker" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number;
  isVerified: boolean;
  rating?: number;
  ratingsCount?: number;
  skills?: string[];
  bio?: string;
  city?: string;
  createdAt: string;
}

export type JobStatus = "open" | "in-progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  address: string;
  price: number;
  hours: number;
  startDate: string;
  status: JobStatus;
  employerId: string;
  employer: Pick<User, "id" | "name" | "rating" | "avatar">;
  workerId?: string;
  applicantsCount: number;
  createdAt: string;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Application {
  id: string;
  jobId: string;
  worker: Pick<User, "id" | "name" | "rating" | "ratingsCount" | "avatar" | "skills" | "city">;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export type TransactionType = "hold" | "release" | "withdraw" | "deposit" | "refund";
export type PaymentStatus = "pending" | "completed" | "failed";

export interface WalletTransaction {
  id: string;
  jobId?: string;
  jobTitle?: string;
  amount: number;
  transactionType: TransactionType;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  participant: Pick<User, "id" | "name" | "avatar">;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Rating {
  id: string;
  rating: number;
  comment: string;
  reviewer: Pick<User, "id" | "name" | "avatar">;
  createdAt: string;
}

export interface Report {
  id: string;
  reportedUser: Pick<User, "id" | "name">;
  reportedBy: Pick<User, "id" | "name">;
  reason: string;
  status: "open" | "reviewed" | "closed";
  jobId?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  heldAmount: number;
  openReports: number;
  jobsToday: number;
  revenueByMonth: { month: string; amount: number }[];
  jobsByCategory: { category: string; count: number }[];
}
