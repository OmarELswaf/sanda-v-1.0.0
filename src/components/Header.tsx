import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Briefcase,
  Wallet,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoHref = user ? "/jobs" : "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "الوظائف", href: "/jobs", icon: <Briefcase className="w-4 h-4" /> },
    ...(user?.role === "employer"
      ? [{ label: "وظائفي", href: "/my-jobs", icon: <Briefcase className="w-4 h-4" /> }]
      : []),
    ...(user?.role === "worker"
      ? [{ label: "المحفظة", href: "/wallet", icon: <Wallet className="w-4 h-4" /> }]
      : []),
    { label: "المحادثات", href: "/chat", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={logoHref} className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">سندة</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notifications — NEW */}
          {user && <NotificationBell />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:inline text-sm">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">{user.phone}</p>
                  <p className="text-xs text-primary mt-1 capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                  <User className="w-4 h-4 mr-2" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/notifications")}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  الإشعارات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wallet")}>
                  <Wallet className="w-4 h-4 mr-2" />
                  المحفظة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  الإعدادات
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="w-4 h-4 mr-2" />
                    لوحة الإدارة
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                إنشاء حساب
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="w-4 h-4" />
                الإشعارات
              </Link>
            )}
            <div className="border-t pt-3">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 py-2 text-sm text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/login")}>
                    تسجيل الدخول
                  </Button>
                  <Button className="flex-1" onClick={() => navigate("/register")}>
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
