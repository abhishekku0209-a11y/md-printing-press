import { cn } from "@/lib/utils";
import type { OrderStatus } from "../../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
  },
  InProgress: {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  Ready: {
    label: "Ready",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  Delivered: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status as string] ?? statusConfig.Pending;
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
