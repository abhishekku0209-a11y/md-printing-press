import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ErrorBoundary } from "../shared/ErrorBoundary";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Quotes", href: "/admin/quotes", icon: MessageSquare },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Portfolio", href: "/admin/portfolio", icon: Image },
  { label: "Services", href: "/admin/services", icon: Package },
  { label: "Testimonials", href: "/admin/testimonials", icon: FileText },
  { label: "Content", href: "/admin/content", icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/admin/login" });
  };

  const sidebar = (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/md-printing-logo.jpg"
            alt="MD Printing Press Logo"
            className="h-8 w-auto object-contain rounded-lg"
          />
          <div className="leading-tight">
            <span className="font-display font-bold text-sm text-sidebar-foreground block">
              MD Printing Press
            </span>
            <span className="text-xs text-muted-foreground font-body">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-ocid="admin-nav">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            location.pathname === href ||
            (href !== "/admin" && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-subtle"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => setSidebarOpen(false)}
              data-ocid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          data-ocid="admin-logout"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-smooth font-body mt-1"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          View Public Site
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
        {sidebar}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative">
          <button
            type="button"
            className="absolute top-3 right-3 p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
          {sidebar}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center justify-between px-4 shadow-subtle">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted/50"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="font-display font-bold text-base text-foreground">
              {NAV_ITEMS.find(
                (i) =>
                  i.href === location.pathname ||
                  (i.href !== "/admin" && location.pathname.startsWith(i.href)),
              )?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-muted-foreground font-body hidden sm:inline">
              bindwala
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <img
                src="/assets/md-printing-logo.jpg"
                alt="MD Printing Press Logo"
                className="h-6 w-auto object-contain rounded"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-background">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
