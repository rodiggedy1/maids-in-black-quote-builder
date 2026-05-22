import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, LogOut, CalendarCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [location, navigate] = useLocation();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
    onError: () => toast.error("Logout failed"),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/new", label: "New Quote", icon: PlusCircle },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="admin-sidebar flex flex-col py-8 px-5 shrink-0">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-ember font-serif text-xl font-bold">MIB</span>
          </div>
          <p className="text-muted-foreground text-xs tracking-widest uppercase font-sans">Quote Builder</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left ${
                location === href
                  ? "bg-ember/15 text-ember"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border pt-4 mt-4">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground truncate">{user?.name || user?.email || "Admin"}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {title && (
          <header className="border-b border-border px-8 py-5 shrink-0">
            <h1 className="font-serif text-2xl text-foreground">{title}</h1>
          </header>
        )}
        <div className="flex-1 px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
