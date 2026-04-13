import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  MessageSquare,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { OrderStatusBadge } from "../../components/admin/OrderStatusBadge";
import { QuoteStatusBadge } from "../../components/admin/QuoteStatusBadge";
import { StatCard } from "../../components/admin/StatCard";
import { useOrders } from "../../hooks/useOrders";
import { useQuotes } from "../../hooks/useQuotes";
import { OrderStatus, QuoteStatus } from "../../types";

function WeeklyLeadsChart({ quotes }: { quotes: { createdAt: bigint }[] }) {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeks = [3, 2, 1, 0].map((weeksAgo) => {
    const start = now - (weeksAgo + 1) * weekMs;
    const end = now - weeksAgo * weekMs;
    const count = quotes.filter((q) => {
      const ts = Number(q.createdAt) / 1_000_000;
      return ts >= start && ts < end;
    }).length;
    const label =
      weeksAgo === 0
        ? "This week"
        : weeksAgo === 1
          ? "Last week"
          : `${weeksAgo + 1}w ago`;
    return { label, count };
  });

  const max = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <Card className="p-5 border-border">
      <h3 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Leads (Last 4 Weeks)
      </h3>
      <div className="flex items-end gap-3 h-28">
        {weeks.map((week) => {
          const heightPct =
            max === 0 ? 0 : Math.round((week.count / max) * 100);
          return (
            <div
              key={week.label}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-xs font-display font-bold text-foreground">
                {week.count}
              </span>
              <div className="w-full flex items-end" style={{ height: "80px" }}>
                <div
                  className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-smooth"
                  style={{
                    height: `${Math.max(heightPct, week.count > 0 ? 8 : 2)}%`,
                    minHeight: week.count > 0 ? "6px" : "2px",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-body text-center truncate w-full">
                {week.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function AdminDashboard() {
  const { data: quotes, isLoading: quotesLoading } = useQuotes();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const navigate = useNavigate();

  const now = Date.now();
  const monthStart = new Date(now);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const leadsThisMonth =
    quotes?.filter(
      (q) => Number(q.createdAt) / 1_000_000 >= monthStart.getTime(),
    ).length ?? 0;
  const pendingQuotes =
    quotes?.filter((q) => q.status === QuoteStatus.New).length ?? 0;
  const inProgressOrders =
    orders?.filter((o) => o.status === OrderStatus.InProgress).length ?? 0;
  const completedOrders =
    orders?.filter((o) => o.status === OrderStatus.Delivered).length ?? 0;

  const recentQuotes = [...(quotes ?? [])]
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 5);
  const recentOrders = [...(orders ?? [])]
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 5);

  if (quotesLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(["s1", "s2", "s3", "s4"] as const).map((k) => (
            <Skeleton key={k} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl md:col-span-2" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Welcome back — here's MD Printing Press at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="font-display font-semibold gap-1.5 hidden sm:flex"
            onClick={() => navigate({ to: "/admin/quotes" })}
            data-ocid="dashboard-view-quotes"
          >
            <MessageSquare className="w-4 h-4" />
            View Quotes
          </Button>
          <Button
            size="sm"
            className="font-display font-semibold gap-1.5"
            onClick={() => navigate({ to: "/admin/orders" })}
            data-ocid="dashboard-new-order"
          >
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads This Month"
          value={leadsThisMonth}
          icon={Users}
          variant="primary"
          data-ocid="stat-leads-month"
        />
        <StatCard
          title="Pending Quotes"
          value={pendingQuotes}
          icon={MessageSquare}
          variant="warning"
          data-ocid="stat-pending-quotes"
        />
        <StatCard
          title="Orders In Progress"
          value={inProgressOrders}
          icon={Package}
          variant="default"
          data-ocid="stat-orders-progress"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          icon={CheckCircle2}
          variant="success"
          data-ocid="stat-completed-orders"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <WeeklyLeadsChart quotes={quotes ?? []} />

        {/* Quick stats */}
        <Card className="p-5 border-border">
          <h3 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Order Pipeline
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Pending",
                count:
                  orders?.filter((o) => o.status === OrderStatus.Pending)
                    .length ?? 0,
                color: "bg-muted-foreground",
              },
              {
                label: "In Progress",
                count: inProgressOrders,
                color: "bg-primary",
              },
              {
                label: "Ready",
                count:
                  orders?.filter((o) => o.status === OrderStatus.Ready)
                    .length ?? 0,
                color: "bg-accent",
              },
              {
                label: "Delivered",
                count: completedOrders,
                color: "bg-green-500",
              },
            ].map(({ label, count, color }) => {
              const total = (orders?.length ?? 0) || 1;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-display font-bold text-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-smooth ${color}`}
                      style={{ width: `${Math.round((count / total) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent tables */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Quotes */}
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Recent Quotes
            </h3>
            <Link
              to="/admin/quotes"
              className="text-xs text-primary hover:underline font-body"
            >
              View all →
            </Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body text-center py-6">
              No quotes yet
            </p>
          ) : (
            <div className="space-y-0">
              {recentQuotes.map((quote) => (
                <div
                  key={String(quote.id)}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0 gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-display font-semibold text-foreground truncate">
                      {quote.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-body truncate">
                      {quote.serviceType}
                    </p>
                  </div>
                  <QuoteStatusBadge status={quote.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:underline font-body"
            >
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body text-center py-6">
              No orders yet
            </p>
          ) : (
            <div className="space-y-0">
              {recentOrders.map((order) => (
                <div
                  key={String(order.id)}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0 gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-display font-semibold text-foreground truncate">
                      {order.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
