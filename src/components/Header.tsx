import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase, Wallet, MessageCircle, User as UserIcon, LogOut, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const publicLinks = [
  { label: "الوظائف", href: "/jobs" },
  { label: "كيف تعمل سندة", href: "/#how" },
  { label: "للأعمال", href: "/#employers" },
];

const authedLinks = (role: string | undefined) => {
  const base = [
    { label: "الوظائف", href: "/jobs", icon: Briefcase },
    { label: "المحفظة", href: "/wallet", icon: Wallet },
    { label: "المحادثات", href: "/chat", icon: MessageCircle },
  ];
  if (role === "employer") base.splice(1, 0, { label: "وظائفي", href: "/my-jobs", icon: Briefcase });
  if (role === "admin") base.push({ label: "الإدارة", href: "/admin", icon: Shield });
  return base;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const links = isAuthenticated ? authedLinks(user?.role) : null;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6 h-16" aria-label="التنقل الرئيسي">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl text-foreground">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>سندة</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {(links ?? publicLinks).map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-primary font-semibold bg-primary-soft" : "text-foreground/70 hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="icon" aria-label="الإشعارات">
                <Bell className="h-5 w-5" />
              </Button>
              {user.role === "employer" && (
                <Button variant="accent" size="sm" asChild>
                  <Link to="/jobs/new">انشر وظيفة</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.role === "worker" ? "عامل" : user.role === "employer" ? "صاحب عمل" : "مسؤول"}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <UserIcon className="ml-2 h-4 w-4" /> ملفي الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wallet")}>
                    <Wallet className="ml-2 h-4 w-4" /> المحفظة
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
                    <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">دخول</Link>
              </Button>
              <Button variant="accent" size="sm" asChild>
                <Link to="/register">إنشاء حساب</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="القائمة"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border bg-card px-4 pb-4">
          <ul className="space-y-1 py-2">
            {(links ?? publicLinks).map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); navigate("/"); }}>
                تسجيل الخروج
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild><Link to="/login" onClick={() => setOpen(false)}>دخول</Link></Button>
                <Button variant="accent" size="sm" asChild><Link to="/register" onClick={() => setOpen(false)}>إنشاء حساب</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
