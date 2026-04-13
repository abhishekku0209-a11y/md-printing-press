import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
} from "../../hooks/useTestimonials";
import type { CreateTestimonialInput, Testimonial } from "../../types";

const makeEmptyForm = (): CreateTestimonialInput => ({
  clientName: "",
  businessType: "",
  quote: "",
  rating: 5n,
  displayOrder: 0n,
  isVisible: true,
});

const SEED_TESTIMONIALS: Omit<CreateTestimonialInput, "displayOrder">[] = [
  {
    clientName: "Rahul Sharma",
    businessType: "Owner – Sharma Stationery, Sector 18 Noida",
    quote:
      "MD Printing Press has been our go-to for visiting cards and brochures for 3 years. Quality is consistently excellent and same-day delivery is a lifesaver for urgent orders.",
    rating: 5n,
    isVisible: true,
  },
  {
    clientName: "Priya Agarwal",
    businessType: "HR Manager – Agarwal Solutions Pvt. Ltd.",
    quote:
      "We needed 500 branded folders on short notice for a client presentation. MD Printing delivered them overnight with zero compromise on quality. Truly professional service.",
    rating: 5n,
    isVisible: true,
  },
  {
    clientName: "Mohit Gupta",
    businessType: "Event Manager – Star Events Noida",
    quote:
      "Ordered flex banners, standees, and brochures for a corporate event. Everything was crisp, vibrant, and ready a day early. Will keep coming back.",
    rating: 5n,
    isVisible: true,
  },
  {
    clientName: "Sushma Verma",
    businessType: "Principal – Verma Public School",
    quote:
      "Got our school annual report printed and bound. The project binding quality was outstanding — clean finish and sturdy covers. Parents and staff were impressed.",
    rating: 5n,
    isVisible: true,
  },
  {
    clientName: "Deepak Jain",
    businessType: "Proprietor – Jain Medical Store",
    quote:
      "Custom prescription pads and letterheads printed at a very reasonable price. Turnaround was faster than any other press in Noida. Highly recommended!",
    rating: 4n,
    isVisible: true,
  },
  {
    clientName: "Kavita Singh",
    businessType: "Freelance Designer – Sector 62 Noida",
    quote:
      "The large format prints for my client's showroom look stunning. Colors are accurate and the paper quality is top notch. MD Printing is my trusted vendor now.",
    rating: 5n,
    isVisible: true,
  },
];

export function AdminTestimonialsPage() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<CreateTestimonialInput>(makeEmptyForm());
  const [seeding, setSeeding] = useState(false);

  const openCreate = () => {
    setEditingItem(null);
    setForm(makeEmptyForm());
    setShowForm(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setForm({
      clientName: item.clientName,
      businessType: item.businessType,
      quote: item.quote,
      rating: item.rating,
      displayOrder: item.displayOrder,
      isVisible: item.isVisible,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!form.clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }
    if (!form.quote.trim()) {
      toast.error("Testimonial text is required.");
      return;
    }
    try {
      if (editingItem) {
        const result = await updateTestimonial.mutateAsync({
          id: editingItem.id,
          input: form,
        });
        if (result) {
          toast.success("Testimonial updated");
          setShowForm(false);
        } else {
          toast.error("Failed to update testimonial — item not found");
        }
      } else {
        await createTestimonial.mutateAsync(form);
        toast.success("Testimonial added");
        setShowForm(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to save testimonial: ${msg}`);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      for (let i = 0; i < SEED_TESTIMONIALS.length; i++) {
        await createTestimonial.mutateAsync({
          ...SEED_TESTIMONIALS[i],
          displayOrder: BigInt(i + 1),
        });
      }
      toast.success(
        `${SEED_TESTIMONIALS.length} placeholder testimonials added`,
      );
    } catch {
      toast.error("Failed to seed testimonials");
    } finally {
      setSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {(["sk1", "sk2", "sk3", "sk4"] as const).map((k) => (
          <Skeleton key={k} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const sorted = [...(testimonials ?? [])].sort((a, b) =>
    Number(a.displayOrder - b.displayOrder),
  );

  return (
    <div className="space-y-5" data-ocid="admin-testimonials">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Testimonials
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {testimonials?.length ?? 0} reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(testimonials?.length ?? 0) === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="font-display font-semibold gap-1.5"
              onClick={handleSeedAll}
              disabled={seeding}
              data-ocid="testimonials-seed"
            >
              <Download className="w-4 h-4" />
              {seeding ? "Importing..." : "Import 6 Samples"}
            </Button>
          )}
          <Button
            size="sm"
            className="font-display font-semibold gap-1.5"
            onClick={openCreate}
            data-ocid="testimonials-add"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card
          className="p-12 text-center border-border"
          data-ocid="testimonials-empty"
        >
          <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-display font-bold text-foreground mb-2">
            No testimonials yet
          </p>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Add client reviews or import realistic placeholder testimonials.
          </p>
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="font-display font-semibold gap-1.5"
              onClick={handleSeedAll}
              disabled={seeding}
            >
              <Download className="w-4 h-4" />
              {seeding ? "Importing..." : "Import 6 Samples"}
            </Button>
            <Button
              size="sm"
              className="font-display font-semibold gap-1.5"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((item) => (
            <Card
              key={String(item.id)}
              className="p-4 border-border hover:shadow-subtle transition-smooth"
              data-ocid={`testimonial-row-${String(item.id)}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground">
                      {item.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground font-body truncate">
                      {item.businessType}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.isVisible
                          ? "border-accent/40 text-accent"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {item.isVisible ? (
                        <Eye className="w-3 h-3 mr-1 inline" />
                      ) : (
                        <EyeOff className="w-3 h-3 mr-1 inline" />
                      )}
                      {item.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={`star-${String(item.id)}-${i}`}
                      className={`w-3.5 h-3.5 ${
                        i <= Number(item.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-foreground font-body italic line-clamp-3">
                  "{item.quote}"
                </p>

                <div className="flex justify-end gap-1 pt-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEdit(item)}
                    data-ocid={`testimonial-edit-${String(item.id)}`}
                    aria-label="Edit testimonial"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-ocid={`testimonial-delete-${String(item.id)}`}
                        aria-label="Delete testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove the testimonial from{" "}
                          {item.clientName}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => !open && setShowForm(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              {editingItem ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-body text-sm">Client Name *</Label>
                <Input
                  required
                  placeholder="Rajesh Kumar"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, clientName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-sm">Business / Role</Label>
                <Input
                  placeholder="Owner – Sharma Boutique"
                  value={form.businessType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, businessType: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Testimonial *</Label>
              <Textarea
                required
                rows={4}
                placeholder="What did the client say?"
                value={form.quote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quote: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, rating: BigInt(r) }))
                    }
                    className="p-0.5 transition-smooth"
                    aria-label={`Rate ${r} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-smooth ${
                        Number(form.rating) >= r
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-body text-muted-foreground">
                  {Number(form.rating)}/5
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Display Order</Label>
              <Input
                type="number"
                min="0"
                value={String(form.displayOrder)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    displayOrder: BigInt(e.target.value || "0"),
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isVisible}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isVisible: v }))
                }
                id="tm-visible"
              />
              <Label
                htmlFor="tm-visible"
                className="font-body text-sm cursor-pointer"
              >
                Visible on public site
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-display font-bold"
                disabled={
                  createTestimonial.isPending || updateTestimonial.isPending
                }
              >
                {createTestimonial.isPending || updateTestimonial.isPending
                  ? "Saving..."
                  : editingItem
                    ? "Save Changes"
                    : "Add Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
