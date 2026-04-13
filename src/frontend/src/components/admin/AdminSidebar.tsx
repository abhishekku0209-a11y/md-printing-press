import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Package,
  Printer,
  Settings,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Quotes", href: "/admin/quotes", icon: MessageSquare },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Portfolio", href: "/admin/portfolio", icon: Image },
  { label: "Services", href: "/admin/services", icon: Package },
  { label: "Testimonials", href: "/admin/testimonials", icon: FileText },
  { label: "Content", href: "/admin/content", icon: Settings },
];

interface AdminSidebarProps {
  onClose?: () => void;
  onLogout: () => void;
}

export function AdminSidebar({ onClose, onLogout }: AdminSidebarProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Printer className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-bold text-sm text-sidebar-foreground block">
              MD Printing Press
            </span>
            <span className="text-xs text-muted-foreground font-body">
              Admin Panel
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
        data-ocid="admin-sidebar-nav"
      >
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
              onClick={onClose}
              data-ocid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {/* Dark mode toggle */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-ocid="admin-theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 shrink-0" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={onLogout}
          data-ocid="admin-logout"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
