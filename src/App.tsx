import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import JobsFeed from "./pages/jobs/JobsFeed";
import JobDetails from "./pages/jobs/JobDetails";
import PostJob from "./pages/jobs/PostJob";
import EditJob from "./pages/jobs/EditJob";
import MyJobs from "./pages/jobs/MyJobs";
import Applicants from "./pages/jobs/Applicants";
import ActiveJob from "./pages/jobs/ActiveJob";
import JobAssignments from "./pages/jobs/JobAssignments";
import Wallet from "./pages/wallet/Wallet";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import Settings from "./pages/settings/Settings";
import Verification from "./pages/settings/Verification";
import Help from "./pages/help/Help";
import About from "./pages/help/About";
import Terms from "./pages/help/Terms";
import Privacy from "./pages/help/Privacy";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminReportDetail from "./pages/admin/AdminReportDetail";
import AdminJobDetail from "./pages/admin/AdminJobDetail";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminChatMonitor from "./pages/admin/AdminChatMonitor";
import AdminUserLogs from "./pages/admin/AdminUserLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

/**
 * Scrolls the window to the top on every client-side route change,
 * so that pages like /chat, /jobs, /profile etc. always open at the top
 * regardless of the previous page's scroll position.
 *
 * Respects prefers-reduced-motion for users who opt out of smooth scrolling.
 * Skips the very first render so a hard reload doesn't fight the browser's
 * default scroll restoration.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "auto" });
  }, [pathname]);

  return null;
}

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
}

function AdminRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user?.role === "admin") {
    return <AdminDashboard />;
  }
  return <Navigate to="/login" replace />;
}

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Jobs */}
        <Route path="/jobs" element={<JobsFeed />} />
        <Route path="/jobs/new" element={<ProtectedRoute roles={["employer"]}><PostJob /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/edit" element={<ProtectedRoute roles={["employer"]}><EditJob /></ProtectedRoute>} />
        <Route path="/jobs/:id/applicants" element={<ProtectedRoute roles={["employer"]}><Applicants /></ProtectedRoute>} />
        <Route path="/jobs/:id/active" element={<ProtectedRoute><ActiveJob /></ProtectedRoute>} />
        <Route path="/jobs/:id/assignments" element={<ProtectedRoute roles={["employer"]}><JobAssignments /></ProtectedRoute>} />
        <Route path="/my-jobs" element={<ProtectedRoute roles={["employer"]}><MyJobs /></ProtectedRoute>} />

        {/* User workspace */}
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications" element={<ProtectedRoute roles={["admin"]}><NotificationsPage /></ProtectedRoute>} />

        {/* Settings */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/settings/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/reports/:id" element={<ProtectedRoute roles={["admin"]}><AdminReportDetail /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute roles={["admin"]}><AdminJobs /></ProtectedRoute>} />
        <Route path="/admin/jobs/:id" element={<ProtectedRoute roles={["admin"]}><AdminJobDetail /></ProtectedRoute>} />
        <Route path="/admin/wallet" element={<ProtectedRoute roles={["admin"]}><AdminWallet /></ProtectedRoute>} />
        <Route path="/admin/chat-monitor" element={<ProtectedRoute roles={["admin"]}><AdminChatMonitor /></ProtectedRoute>} />
        <Route path="/admin/user-logs" element={<ProtectedRoute roles={["admin"]}><AdminUserLogs /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;