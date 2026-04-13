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
  Calendar,
  CheckCircle2,
  Eye,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuoteStatusBadge } from "../../components/admin/QuoteStatusBadge";
import { useCreateOrder } from "../../hooks/useOrders";
import { useQuotes, useUpdateQuoteStatus } from "../../hooks/useQuotes";
import type { CreateOrderInput, Quote } from "../../types";
import { QuoteStatus } from "../../types";

type FilterTab = "all" | "New" | "Contacted" | "Won" | "Lost";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "New", label: "New" },
  { key: "Contacted", label: "Contacted" },
  { key: "Won", label: "Won" },
  { key: "Lost", label: "Lost" },
];

function formatDate(nanosTs: bigint) {
  return new Date(Number(nanosTs) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminQuotesPage() {
  const { data: quotes, isLoading } = useQuotes();
  const updateStatus = useUpdateQuoteStatus();
  const createOrder = useCreateOrder();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [convertingQuote, setConvertingQuote] = useState<Quote | null>(null);
  const [orderForm, setOrderForm] = useState<CreateOrderInput>({
    clientName: "",
    serviceType: "",
    description: "",
    amount: 0,
    quoteId: undefined,
  });

  const filtered = (quotes ?? [])
    .filter((q) => activeTab === "all" || (q.status as string) === activeTab)
    .sort((a, b) => Number(b.createdAt - a.createdAt));

  const tabCounts = TABS.reduce(
    (acc, t) => {
      acc[t.key] =
        t.key === "all"
          ? (quotes?.length ?? 0)
          : (quotes ?? []).filter((q) => (q.status as string) === t.key).length;
      return acc;
    },
    {} as Record<FilterTab, number>,
  );

  const handleStatus = async (id: bigint, status: QuoteStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openConvert = (quote: Quote) => {
    setConvertingQuote(quote);
    setOrderForm({
      clientName: quote.name,
      serviceType: quote.serviceType,
      description: quote.projectDetails,
      amount: 0,
      quoteId: quote.id,
    });
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingQuote) return;
    try {
      await createOrder.mutateAsync(orderForm);
      await updateStatus.mutateAsync({
        id: convertingQuote.id,
        status: QuoteStatus.Won,
      });
      toast.success("Quote converted to order!");
      setConvertingQuote(null);
    } catch {
      toast.error("Failed to convert quote");
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
    <div className="space-y-5" data-ocid="admin-quotes">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Quote Requests
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {quotes?.length ?? 0} total — manage leads and convert to orders
          </p>
        </div>
      </div>

      {/* Tab filters */}
      <div
        className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit"
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
            data-ocid={`quotes-tab-${tab.key}`}
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

      {/* Quote list */}
      {filtered.length === 0 ? (
        <Card
          className="p-12 text-center border-border"
          data-ocid="quotes-empty"
        >
          <p className="font-display font-bold text-foreground mb-2">
            No quotes found
          </p>
          <p className="text-sm text-muted-foreground font-body">
            {activeTab === "all"
              ? "Quote requests from your public website will appear here."
              : `No ${activeTab} quotes yet.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <Card
              key={String(quote.id)}
              className="p-4 border-border hover:shadow-subtle transition-smooth"
              data-ocid={`quote-row-${String(quote.id)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-bold text-sm text-foreground">
                      {quote.name}
                    </p>
                    <QuoteStatusBadge status={quote.status} />
                    <span className="text-xs text-primary font-display font-semibold bg-primary/8 px-2 py-0.5 rounded-full">
                      {quote.serviceType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {quote.phone}
                    </span>
                    {quote.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {quote.email}
                      </span>
                    )}
                    {quote.budgetRange && (
                      <span>Budget: {quote.budgetRange}</span>
                    )}
                    {quote.timeline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {quote.timeline}
                      </span>
                    )}
                  </div>
                  {quote.projectDetails && (
                    <p className="text-xs text-foreground font-body bg-muted/50 rounded-md px-3 py-2 line-clamp-2">
                      {quote.projectDetails}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground font-body">
                    Received: {formatDate(quote.createdAt)}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-body text-xs gap-1.5 h-8"
                    onClick={() => setViewingQuote(quote)}
                    data-ocid={`quote-view-${String(quote.id)}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </Button>
                  {(quote.status as string) === "New" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-body text-xs gap-1.5 h-8"
                      onClick={() =>
                        handleStatus(quote.id, QuoteStatus.Contacted)
                      }
                      disabled={updateStatus.isPending}
                      data-ocid={`quote-contact-${String(quote.id)}`}
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {((quote.status as string) === "New" ||
                    (quote.status as string) === "Contacted") && (
                    <Button
                      size="sm"
                      className="font-display font-semibold text-xs gap-1.5 h-8"
                      onClick={() => openConvert(quote)}
                      data-ocid={`quote-convert-${String(quote.id)}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Convert
                    </Button>
                  )}
                  {(quote.status as string) !== "Won" &&
                    (quote.status as string) !== "Lost" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-body text-xs gap-1.5 h-8 text-accent hover:text-accent"
                          onClick={() =>
                            handleStatus(quote.id, QuoteStatus.Won)
                          }
                          disabled={updateStatus.isPending}
                          data-ocid={`quote-won-${String(quote.id)}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Won
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-body text-xs gap-1.5 h-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            handleStatus(quote.id, QuoteStatus.Lost)
                          }
                          disabled={updateStatus.isPending}
                          data-ocid={`quote-lost-${String(quote.id)}`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Lost
                        </Button>
                      </>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <Dialog
        open={!!viewingQuote}
        onOpenChange={(o) => !o && setViewingQuote(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Quote Details
            </DialogTitle>
          </DialogHeader>
          {viewingQuote && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-lg text-foreground">
                    {viewingQuote.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    #{String(viewingQuote.id)}
                  </p>
                </div>
                <QuoteStatusBadge status={viewingQuote.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Phone
                  </p>
                  <p className="font-body text-foreground">
                    {viewingQuote.phone}
                  </p>
                </div>
                {viewingQuote.email && (
                  <div>
                    <p className="text-xs text-muted-foreground font-body mb-0.5">
                      Email
                    </p>
                    <p className="font-body text-foreground break-all">
                      {viewingQuote.email}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Service
                  </p>
                  <p className="font-body text-foreground">
                    {viewingQuote.serviceType}
                  </p>
                </div>
                {viewingQuote.budgetRange && (
                  <div>
                    <p className="text-xs text-muted-foreground font-body mb-0.5">
                      Budget
                    </p>
                    <p className="font-body text-foreground">
                      {viewingQuote.budgetRange}
                    </p>
                  </div>
                )}
                {viewingQuote.timeline && (
                  <div>
                    <p className="text-xs text-muted-foreground font-body mb-0.5">
                      Timeline
                    </p>
                    <p className="font-body text-foreground">
                      {viewingQuote.timeline}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Submitted
                  </p>
                  <p className="font-body text-foreground">
                    {formatDate(viewingQuote.createdAt)}
                  </p>
                </div>
              </div>
              {viewingQuote.projectDetails && (
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-1">
                    Project Details
                  </p>
                  <p className="text-sm font-body text-foreground bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">
                    {viewingQuote.projectDetails}
                  </p>
                </div>
              )}
              {/* Quick status actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                {(viewingQuote.status as string) === "New" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-body text-xs"
                    onClick={() => {
                      handleStatus(viewingQuote.id, QuoteStatus.Contacted);
                      setViewingQuote(null);
                    }}
                  >
                    Mark Contacted
                  </Button>
                )}
                <Button
                  size="sm"
                  className="font-display font-semibold text-xs gap-1.5"
                  onClick={() => {
                    setViewingQuote(null);
                    openConvert(viewingQuote);
                  }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Convert to Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Convert to Order Modal */}
      <Dialog
        open={!!convertingQuote}
        onOpenChange={(o) => !o && setConvertingQuote(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Convert to Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConvert} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Client Name *</Label>
              <Input
                required
                value={orderForm.clientName}
                onChange={(e) =>
                  setOrderForm((p) => ({ ...p, clientName: e.target.value }))
                }
                data-ocid="convert-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Service Type *</Label>
              <Input
                required
                value={orderForm.serviceType}
                onChange={(e) =>
                  setOrderForm((p) => ({ ...p, serviceType: e.target.value }))
                }
                data-ocid="convert-service"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Amount (₹) *</Label>
              <Input
                required
                type="number"
                min="0"
                placeholder="2500"
                value={orderForm.amount || ""}
                onChange={(e) =>
                  setOrderForm((p) => ({
                    ...p,
                    amount: Number(e.target.value),
                  }))
                }
                data-ocid="convert-amount"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Description</Label>
              <Textarea
                rows={3}
                value={orderForm.description}
                onChange={(e) =>
                  setOrderForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="convert-desc"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConvertingQuote(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-display font-bold"
                disabled={createOrder.isPending || updateStatus.isPending}
                data-ocid="convert-submit"
              >
                {createOrder.isPending ? "Creating..." : "Create Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
