import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  IndianRupee,
  Package,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatusBadge } from "../../components/admin/OrderStatusBadge";
import {
  useCreateOrder,
  useOrders,
  useUpdateOrderStatus,
} from "../../hooks/useOrders";
import type { CreateOrderInput, Order } from "../../types";
import { OrderStatus } from "../../types";

type FilterTab = "all" | "Pending" | "InProgress" | "Ready" | "Delivered";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "InProgress", label: "In Progress" },
  { key: "Ready", label: "Ready" },
  { key: "Delivered", label: "Delivered" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.Pending]: OrderStatus.InProgress,
  [OrderStatus.InProgress]: OrderStatus.Ready,
  [OrderStatus.Ready]: OrderStatus.Delivered,
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.Pending]: "Start Work",
  [OrderStatus.InProgress]: "Mark Ready",
  [OrderStatus.Ready]: "Deliver",
};

const SERVICE_TYPES = [
  "Offset Printing",
  "Digital Printing",
  "Custom Packaging",
  "Large Format",
  "Project Binding",
  "Business Cards",
  "Brochures",
  "Signage",
  "Banners",
  "Self-Ink Stamps",
];

const EMPTY_FORM: CreateOrderInput = {
  clientName: "",
  serviceType: "",
  description: "",
  amount: 0,
  quoteId: undefined,
};

function formatDate(nanosTs: bigint) {
  return new Date(Number(nanosTs) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const createOrder = useCreateOrder();
  const updateStatus = useUpdateOrderStatus();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<CreateOrderInput>(EMPTY_FORM);

  const filtered = (orders ?? [])
    .filter((o) => activeTab === "all" || (o.status as string) === activeTab)
    .sort((a, b) => Number(b.createdAt - a.createdAt));

  const tabCounts = TABS.reduce(
    (acc, t) => {
      acc[t.key] =
        t.key === "all"
          ? (orders?.length ?? 0)
          : (orders ?? []).filter((o) => (o.status as string) === t.key).length;
      return acc;
    },
    {} as Record<FilterTab, number>,
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder.mutateAsync(form);
      toast.success("Order created successfully");
      setShowCreate(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to create order");
    }
  };

  const handleAdvance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ id: order.id, status: next });
      toast.success(
        `Order marked as ${next === OrderStatus.InProgress ? "In Progress" : next}`,
      );
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleDeliver = async (id: bigint) => {
    try {
      await updateStatus.mutateAsync({ id, status: OrderStatus.Delivered });
      toast.success("Order marked as Delivered!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {(["sk1", "sk2", "sk3", "sk4", "sk5"] as const).map((k) => (
          <Skeleton key={k} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin-orders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Orders
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {orders?.length ?? 0} total orders
          </p>
        </div>
        <Button
          size="sm"
          className="font-display font-semibold gap-1.5"
          onClick={() => setShowCreate(true)}
          data-ocid="orders-create"
        >
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      {/* Status tabs */}
      <div
        className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit flex-wrap"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold transition-smooth flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`orders-tab-${tab.key}`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-body ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <Card
          className="p-12 text-center border-border"
          data-ocid="orders-empty"
        >
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-display font-bold text-foreground mb-2">
            No orders found
          </p>
          <p className="text-sm text-muted-foreground font-body mb-4">
            {activeTab === "all"
              ? "Create your first order to get started."
              : `No ${activeTab} orders.`}
          </p>
          {activeTab === "all" && (
            <Button
              size="sm"
              className="font-display font-bold gap-1.5"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-4 h-4" />
              Create Order
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card
              key={String(order.id)}
              className="p-4 border-border hover:shadow-subtle transition-smooth"
              data-ocid={`order-row-${String(order.id)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-bold text-sm text-foreground">
                      {order.clientName}
                    </p>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs text-primary font-display font-semibold bg-primary/8 px-2 py-0.5 rounded-full">
                      {order.serviceType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1 font-display font-bold text-foreground">
                      <IndianRupee className="w-3 h-3" />
                      {order.amount.toLocaleString("en-IN")}
                    </span>
                    <span>Created: {formatDate(order.createdAt)}</span>
                    {order.updatedAt !== order.createdAt && (
                      <span>Updated: {formatDate(order.updatedAt)}</span>
                    )}
                  </div>
                  {order.description && (
                    <p className="text-xs text-foreground font-body bg-muted/50 rounded-md px-3 py-2 line-clamp-2">
                      {order.description}
                    </p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-body text-xs gap-1.5 h-8"
                    onClick={() => setViewingOrder(order)}
                    data-ocid={`order-view-${String(order.id)}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </Button>
                  {NEXT_STATUS[order.status] && (
                    <Button
                      size="sm"
                      className="font-display font-semibold text-xs gap-1.5 h-8"
                      onClick={() => handleAdvance(order)}
                      disabled={updateStatus.isPending}
                      data-ocid={`order-advance-${String(order.id)}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      {NEXT_LABEL[order.status]}
                    </Button>
                  )}
                  {(order.status as string) !== "Delivered" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-body text-xs gap-1.5 h-8 text-green-600 hover:text-green-600"
                      onClick={() => handleDeliver(order.id)}
                      disabled={updateStatus.isPending}
                      data-ocid={`order-deliver-${String(order.id)}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Deliver
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Create New Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Client Name *</Label>
              <Input
                required
                placeholder="Rajesh Kumar"
                value={form.clientName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, clientName: e.target.value }))
                }
                data-ocid="order-form-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Service Type *</Label>
              <Select
                value={form.serviceType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, serviceType: v }))
                }
              >
                <SelectTrigger data-ocid="order-form-service">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Amount (₹) *</Label>
              <Input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="2500"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: Number(e.target.value) }))
                }
                data-ocid="order-form-amount"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Description</Label>
              <Textarea
                rows={3}
                placeholder="Order details..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="order-form-desc"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-display font-bold"
                disabled={createOrder.isPending}
                data-ocid="order-form-submit"
              >
                {createOrder.isPending ? "Creating..." : "Create Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog
        open={!!viewingOrder}
        onOpenChange={(o) => !o && setViewingOrder(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-lg text-foreground">
                    {viewingOrder.clientName}
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    #{String(viewingOrder.id)}
                  </p>
                </div>
                <OrderStatusBadge status={viewingOrder.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Service
                  </p>
                  <p className="font-body text-foreground">
                    {viewingOrder.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Amount
                  </p>
                  <p className="font-display font-bold text-foreground">
                    ₹{viewingOrder.amount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Created
                  </p>
                  <p className="font-body text-foreground">
                    {formatDate(viewingOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Updated
                  </p>
                  <p className="font-body text-foreground">
                    {formatDate(viewingOrder.updatedAt)}
                  </p>
                </div>
              </div>
              {viewingOrder.description && (
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-1">
                    Description
                  </p>
                  <p className="text-sm font-body text-foreground bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">
                    {viewingOrder.description}
                  </p>
                </div>
              )}
              {/* Quick advance */}
              {NEXT_STATUS[viewingOrder.status] && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    className="font-display font-semibold gap-1.5"
                    onClick={() => {
                      handleAdvance(viewingOrder);
                      setViewingOrder(null);
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    {NEXT_LABEL[viewingOrder.status]}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
