import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      <div className="flex-1 bg-muted/10 py-6 md:py-10 px-4">
        <div className="max-w-6xl mx-auto bg-card rounded-2xl shadow-md border border-border overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 border-l bg-muted/30 p-5 space-y-2 hidden md:block">
              <nav className="space-y-1">
                <Button
                  variant={isActive("/settings") ? "secondary" : "ghost"}
                  className="w-full justify-start text-right font-bold gap-2 text-sm rounded-xl"
                  onClick={() => navigate("/settings")}
                >
                  <Shield className="w-4 h-4" />
                  عام والأمان
                </Button>
                <Button
                  variant={isActive("/settings/verification") ? "secondary" : "ghost"}
                  className="w-full justify-start text-right gap-2 text-sm rounded-xl"
                  onClick={() => navigate("/settings/verification")}
                >
                  <UserCheck className="w-4 h-4" />
                  توثيق الحساب (ID)
                </Button>
                <div className="border-t border-border my-3" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-right gap-2 text-sm rounded-xl"
                  onClick={() => navigate("/profile/" + user?.id)}
                >
                  عرض ملفك الشخصي
                </Button>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 flex justify-center">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}