import { cn } from "@/lib/utils";
import type { QuoteStatus } from "../../types";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  New: {
    label: "New",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  Contacted: {
    label: "Contacted",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  Won: { label: "Won", className: "bg-accent/10 text-accent border-accent/20" },
  Lost: {
    label: "Lost",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  const config = statusConfig[status as string] ?? statusConfig.New;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-display font-semibold border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
