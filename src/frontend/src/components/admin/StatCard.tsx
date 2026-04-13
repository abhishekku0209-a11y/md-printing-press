import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  "data-ocid"?: string;
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-accent/5 border-accent/20",
  warning: "bg-amber-500/5 border-amber-500/20",
  danger: "bg-destructive/5 border-destructive/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-accent/10 text-accent",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  "data-ocid": dataOcid,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-3 transition-smooth shadow-subtle hover:shadow-elevated",
        variantStyles[variant],
      )}
      data-ocid={dataOcid}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconStyles[variant],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-display font-semibold px-2 py-1 rounded-full",
              trend.value >= 0
                ? "bg-accent/10 text-accent"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground leading-none">
          {value}
        </p>
        <p className="text-sm text-muted-foreground font-body mt-1">{title}</p>
      </div>
    </div>
  );
}
