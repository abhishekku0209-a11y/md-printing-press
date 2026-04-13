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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useImageUpload } from "../../hooks/useImageUpload";
import {
  useCreatePortfolioItem,
  useDeletePortfolioItem,
  usePortfolio,
  useUpdatePortfolioItem,
} from "../../hooks/usePortfolio";
import type { CreatePortfolioItemInput, PortfolioItem } from "../../types";

const CATEGORIES = [
  "Brochures",
  "Business Cards",
  "Signage",
  "Binding",
  "Packaging",
  "Digital Prints",
  "Banners",
  "Other",
];

const makeEmptyForm = (): CreatePortfolioItemInput => ({
  title: "",
  serviceCategory: "",
  imageUrl: "",
  displayOrder: 0n,
  isVisible: true,
});

export function AdminPortfolioPage() {
  const { data: items, isLoading } = usePortfolio();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<CreatePortfolioItemInput>(makeEmptyForm());
  // Ref holds the current imageUrl synchronously — prevents stale closure on submit
  const imageUrlRef = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUpload = useImageUpload();

  const openCreate = () => {
    setEditingItem(null);
    const empty = makeEmptyForm();
    setForm(empty);
    imageUrlRef.current = "";
    imageUpload.clearPreview();
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    const f: CreatePortfolioItemInput = {
      title: item.title,
      serviceCategory: item.serviceCategory,
      imageUrl: item.imageUrl,
      displayOrder: item.displayOrder,
      isVisible: item.isVisible,
    };
    setForm(f);
    imageUrlRef.current = item.imageUrl;
    imageUpload.setPreviewUrl(item.imageUrl || null);
    setShowForm(true);
  };

  const handleImageUploaded = (url: string) => {
    // Sync ref updated immediately; state updated for re-render
    imageUrlRef.current = url;
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUpload.isUploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }
    // Use imageUrlRef for guaranteed fresh value
    const resolvedImageUrl = imageUrlRef.current;
    if (!resolvedImageUrl) {
      toast.error("Please upload an image for this portfolio item.");
      return;
    }
    const input: CreatePortfolioItemInput = {
      ...form,
      imageUrl: resolvedImageUrl,
    };
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, input });
        toast.success("Portfolio item updated");
      } else {
        await createItem.mutateAsync(input);
        toast.success("Portfolio item added");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save portfolio item");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Portfolio item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleRemoveImage = () => {
    imageUpload.clearPreview();
    imageUrlRef.current = "";
    setForm((p) => ({ ...p, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      imageUpload.clearPreview();
      imageUrlRef.current = "";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(
          ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"] as const
        ).map((k) => (
          <Skeleton key={k} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  const sorted = [...(items ?? [])].sort((a, b) =>
    Number(a.displayOrder - b.displayOrder),
  );

  return (
    <div className="space-y-5" data-ocid="admin-portfolio">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Portfolio
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {items?.length ?? 0} items
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="font-display font-bold gap-1.5"
          data-ocid="portfolio-add"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Card
          className="p-12 text-center border-border"
          data-ocid="portfolio-empty"
        >
          <p className="font-display font-bold text-foreground mb-2">
            No portfolio items yet
          </p>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Add your first work sample to showcase on the public website.
          </p>
          <Button
            onClick={openCreate}
            size="sm"
            className="font-display font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Portfolio Item
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((item) => (
            <Card
              key={String(item.id)}
              className="overflow-hidden border-border group"
              data-ocid={`portfolio-item-${String(item.id)}`}
            >
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
                    No Image
                  </div>
                )}
                {!item.isVisible && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <EyeOff className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-display font-bold text-sm text-foreground truncate">
                  {item.title}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary"
                  >
                    {item.serviceCategory}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(item)}
                      data-ocid={`portfolio-edit-${String(item.id)}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          data-ocid={`portfolio-delete-${String(item.id)}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Portfolio Item?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove "{item.title}" from
                            your portfolio.
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
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Title *</Label>
              <Input
                required
                placeholder="Trifold Brochure – Malhotra Co."
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Category *</Label>
              <Select
                value={form.serviceCategory}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, serviceCategory: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label className="font-body text-sm">
                Portfolio Image <span className="text-destructive">*</span>
              </Label>
              {imageUpload.previewUrl ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={imageUpload.previewUrl}
                    alt="Portfolio preview"
                    className="w-full h-full object-cover"
                  />
                  {imageUpload.isUploading && (
                    <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-sm font-body text-foreground">
                        Uploading...
                      </span>
                    </div>
                  )}
                  {!imageUpload.isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  )}
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-ocid="portfolio-image-upload"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm font-body text-muted-foreground">
                      Click to upload image
                    </span>
                    <span className="text-xs text-muted-foreground font-body">
                      JPG, PNG, WebP — any size
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      imageUpload.handleFileChange(e, handleImageUploaded)
                    }
                  />
                </label>
              )}
              {imageUpload.uploadError && (
                <p className="text-xs text-destructive font-body">
                  {imageUpload.uploadError}
                </p>
              )}
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
                id="pf-visible"
              />
              <Label
                htmlFor="pf-visible"
                className="font-body text-sm flex items-center gap-2 cursor-pointer"
              >
                {form.isVisible ? (
                  <Eye className="w-4 h-4 text-accent" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                Visible on public site
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-display font-bold"
                disabled={
                  createItem.isPending ||
                  updateItem.isPending ||
                  imageUpload.isUploading
                }
              >
                {createItem.isPending ||
                updateItem.isPending ||
                imageUpload.isUploading
                  ? "Saving..."
                  : editingItem
                    ? "Save Changes"
                    : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
