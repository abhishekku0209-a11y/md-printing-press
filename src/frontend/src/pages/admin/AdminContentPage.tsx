import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useContentBlocks, useSetContentBlock } from "../../hooks/useContent";
import type { ContentBlock } from "../../types";

const CONTENT_DEFS: {
  key: string;
  label: string;
  description: string;
  multiline?: boolean;
}[] = [
  {
    key: "hero_headline",
    label: "Hero Headline",
    description: "Main headline shown at top of the homepage",
    multiline: false,
  },
  {
    key: "hero_subtext",
    label: "Hero Subtext",
    description: "Tagline or description below the hero headline",
    multiline: false,
  },
  {
    key: "about_text",
    label: "About Us Text",
    description: "Description shown in the About section",
    multiline: true,
  },
  {
    key: "business_hours",
    label: "Business Hours",
    description:
      "Opening hours shown in Contact section (e.g. Mon–Sat: 9am–8pm)",
    multiline: false,
  },
  {
    key: "contact_phone",
    label: "Contact Phone",
    description: "Primary business phone / WhatsApp number",
    multiline: false,
  },
  {
    key: "contact_email",
    label: "Contact Email",
    description: "Business email address displayed publicly",
    multiline: false,
  },
  {
    key: "contact_address",
    label: "Contact Address",
    description: "Full business address shown in Contact section",
    multiline: true,
  },
];

function ContentRow({
  block,
  def,
  onSave,
}: {
  block: ContentBlock;
  def: (typeof CONTENT_DEFS)[number];
  onSave: (key: string, value: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(block.value);
  const [saving, setSaving] = useState(false);

  // Sync local edit value when block.value changes from backend (e.g. after save + invalidation)
  useEffect(() => {
    if (!editing) {
      setValue(block.value);
    }
  }, [block.value, editing]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(block.key, value);
      setEditing(false);
    } catch {
      // error toast handled in parent onSave
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(block.value);
    setEditing(false);
  };

  return (
    <Card
      className="p-4 border-border"
      data-ocid={`content-block-${block.key}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-sm text-foreground">
            {def.label}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            {def.description}
          </p>
          <code className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded mt-1 inline-block">
            {block.key}
          </code>
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setEditing(true)}
            data-ocid={`content-edit-${block.key}`}
            aria-label={`Edit ${def.label}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          {def.multiline ? (
            <Textarea
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-sm font-body"
              data-ocid={`content-input-${block.key}`}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-sm font-body"
              data-ocid={`content-input-${block.key}`}
            />
          )}
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-1.5 font-body"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="font-display font-bold gap-1.5"
              data-ocid={`content-save-${block.key}`}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <p
          className={`text-sm font-body rounded-md px-3 py-2 whitespace-pre-wrap line-clamp-3 ${
            block.value
              ? "bg-muted/40 text-foreground"
              : "bg-muted/20 text-muted-foreground italic"
          }`}
        >
          {block.value || "Not set — click edit to add content"}
        </p>
      )}
    </Card>
  );
}

export function AdminContentPage() {
  const { data: blocks, isLoading } = useContentBlocks();
  const setBlock = useSetContentBlock();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSave = async (key: string, value: string) => {
    try {
      await setBlock.mutateAsync({ key, value });
      toast.success("Content updated — changes are now live on public site");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to update content: ${msg}`);
      throw err; // re-throw so ContentRow can handle saving state
    }
  };

  // Merge backend data with our defined content blocks
  const displayBlocks = CONTENT_DEFS.map((def) => {
    const existing = blocks?.find((b) => b.key === def.key);
    return {
      block: existing ?? { key: def.key, value: "", updatedAt: 0n },
      def,
    };
  });

  // Custom blocks not in standard list
  const extraBlocks = (blocks ?? []).filter(
    (b) => !CONTENT_DEFS.some((d) => d.key === b.key),
  );

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = newKey.trim();
    if (!trimmedKey) return;
    try {
      await setBlock.mutateAsync({ key: trimmedKey, value: newValue.trim() });
      toast.success("Custom content block added");
      setNewKey("");
      setNewValue("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to add block: ${msg}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {(["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7"] as const).map(
          (k) => (
            <Skeleton key={k} className="h-24 rounded-xl" />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin-content">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          Website Content
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Edit text blocks shown on the public website. Changes are live
          immediately.
        </p>
      </div>

      {/* Standard content blocks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
            Standard Content Blocks
          </h3>
          <Badge variant="outline" className="text-xs">
            {displayBlocks.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {displayBlocks.map(({ block, def }) => (
            <ContentRow
              key={block.key}
              block={block}
              def={def}
              onSave={handleSave}
            />
          ))}
        </div>
      </div>

      {/* Extra / custom blocks */}
      {extraBlocks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
              Custom Blocks
            </h3>
            <Badge variant="outline" className="text-xs">
              {extraBlocks.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {extraBlocks.map((block) => (
              <ContentRow
                key={block.key}
                block={block}
                def={{
                  key: block.key,
                  label: block.key,
                  description: "Custom content block",
                }}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add custom block */}
      <Card className="p-5 border-border border-dashed">
        <h3 className="font-display font-bold text-sm text-foreground mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Add Custom Content Block
        </h3>
        <p className="text-xs text-muted-foreground font-body mb-4">
          Create additional content blocks for custom sections on your website.
        </p>
        <form onSubmit={handleAddNew} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Block Key</Label>
              <Input
                placeholder="e.g. footer_tagline"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="font-mono text-sm"
                data-ocid="content-new-key"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Value</Label>
              <Input
                placeholder="Content value..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                data-ocid="content-new-value"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="font-display font-bold gap-1.5"
            disabled={!newKey.trim() || setBlock.isPending}
            data-ocid="content-add-new"
          >
            <Save className="w-3.5 h-3.5" />
            Add Block
          </Button>
        </form>
      </Card>
    </div>
  );
}
