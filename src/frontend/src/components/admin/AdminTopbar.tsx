import { cn } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";
import { Menu, Moon, Printer, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/quotes": "Quotes",
  "/admin/orders": "Orders",
  "/admin/portfolio": "Portfolio",
  "/admin/services": "Services",
  "/admin/testimonials": "Testimonials",
  "/admin/content": "Content",
};

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const pageTitle =
    NAV_LABELS[location.pathname] ??
    Object.entries(NAV_LABELS).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center px-4 shadow-subtle gap-3">
      <button
        type="button"
        className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted/50 transition-smooth"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        data-ocid="admin-menu-toggle"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-display font-bold text-base text-foreground flex-1">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth",
          )}
          aria-label="Toggle theme"
          data-ocid="admin-topbar-theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Printer className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-body text-muted-foreground hidden sm:inline">
            bindwala
          </span>
        </div>
      </div>
    </header>
  );
}
