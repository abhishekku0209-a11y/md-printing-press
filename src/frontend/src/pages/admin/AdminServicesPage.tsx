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
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "../../hooks/useServices";
import type { CreateServiceInput, Service } from "../../types";

const makeEmptyForm = (): CreateServiceInput => ({
  name: "",
  description: "",
  icon: "🖨️",
  displayOrder: 0n,
  isActive: true,
  imageUrl: undefined,
});

export function AdminServicesPage() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<CreateServiceInput>(makeEmptyForm());
  // Separate ref to hold the current imageUrl synchronously (avoids stale closure bug)
  const imageUrlRef = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUpload = useImageUpload();

  const openCreate = () => {
    setEditingService(null);
    const empty = makeEmptyForm();
    setForm(empty);
    imageUrlRef.current = undefined;
    imageUpload.clearPreview();
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    const f: CreateServiceInput = {
      name: service.name,
      description: service.description,
      icon: service.icon,
      displayOrder: service.displayOrder,
      isActive: service.isActive,
      imageUrl: service.imageUrl,
    };
    setForm(f);
    imageUrlRef.current = service.imageUrl ?? undefined;
    imageUpload.setPreviewUrl(service.imageUrl ?? null);
    setShowForm(true);
  };

  const handleImageUploaded = (url: string) => {
    // Update both the ref (sync) and form state so UI reflects the URL
    imageUrlRef.current = url;
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUpload.isUploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }
    // Use imageUrlRef for the freshest URL value — avoids stale closure
    const input: CreateServiceInput = {
      ...form,
      imageUrl: imageUrlRef.current,
    };
    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService.id, input });
        toast.success("Service updated");
      } else {
        await createService.mutateAsync(input);
        toast.success("Service created");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const handleRemoveImage = () => {
    imageUpload.clearPreview();
    imageUrlRef.current = undefined;
    setForm((p) => ({ ...p, imageUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      imageUpload.clearPreview();
      imageUrlRef.current = undefined;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {(["sk1", "sk2", "sk3", "sk4"] as const).map((k) => (
          <Skeleton key={k} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const sorted = [...(services ?? [])].sort((a, b) =>
    Number(a.displayOrder - b.displayOrder),
  );

  return (
    <div className="space-y-5" data-ocid="admin-services">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Services
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {services?.length ?? 0} services
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="font-display font-bold gap-1.5"
          data-ocid="services-add"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Card
          className="p-12 text-center border-border"
          data-ocid="services-empty"
        >
          <p className="font-display font-bold text-foreground mb-2">
            No services yet
          </p>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Add services to display on your public website.
          </p>
          <Button
            onClick={openCreate}
            size="sm"
            className="font-display font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((service) => (
            <Card
              key={String(service.id)}
              className="p-4 border-border hover:shadow-subtle transition-smooth"
              data-ocid={`service-row-${String(service.id)}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    service.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-bold text-sm text-foreground">
                      {service.name}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${service.isActive ? "border-accent/40 text-accent" : "border-border text-muted-foreground"}`}
                    >
                      {service.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-body line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(service)}
                    data-ocid={`service-edit-${String(service.id)}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        data-ocid={`service-delete-${String(service.id)}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove the "{service.name}"
                          service.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(service.id)}
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

      <Dialog open={showForm} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <Label className="font-body text-sm">Icon (emoji)</Label>
                <Input
                  placeholder="🖨️"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  className="text-center text-xl"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="font-body text-sm">Service Name *</Label>
                <Input
                  required
                  placeholder="Offset Printing"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Optional image upload */}
            <div className="space-y-1.5">
              <Label className="font-body text-sm">
                Service Image{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              {imageUpload.previewUrl ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={imageUpload.previewUrl}
                    alt="Service preview"
                    className="w-full h-full object-cover"
                  />
                  {imageUpload.isUploading && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-body text-foreground">
                        Uploading...
                      </span>
                    </div>
                  )}
                  {!imageUpload.isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  )}
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-ocid="service-image-upload"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-body">
                      Click to upload image
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
              <Label className="font-body text-sm">Description *</Label>
              <Textarea
                required
                rows={3}
                placeholder="Describe this service..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
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
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                id="svc-active"
              />
              <Label
                htmlFor="svc-active"
                className="font-body text-sm flex items-center gap-2 cursor-pointer"
              >
                {form.isActive ? (
                  <Eye className="w-4 h-4 text-accent" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                Show on public site
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
                  createService.isPending ||
                  updateService.isPending ||
                  imageUpload.isUploading
                }
              >
                {createService.isPending ||
                updateService.isPending ||
                imageUpload.isUploading
                  ? "Saving..."
                  : editingService
                    ? "Save Changes"
                    : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
