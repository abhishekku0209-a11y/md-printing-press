import { cn } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <article
      className={cn(
        "group relative bg-card border border-border rounded-xl p-5 cursor-default",
        "hover:shadow-elevated hover:-translate-y-1 transition-smooth",
        "hover:border-primary/30",
        className,
      )}
      data-ocid="service-card"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 transition-smooth">
        {service.icon || "🖨️"}
      </div>

      <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
        {service.name}
      </h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
        {service.description}
      </p>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-smooth origin-left" />
    </article>
  );
}

// Fallback static service card for skeleton
interface StaticServiceCardProps {
  icon: string;
  name: string;
  description: string;
  highlight?: string;
}

export function StaticServiceCard({
  icon,
  name,
  description,
  highlight,
}: StaticServiceCardProps) {
  return (
    <article
      className="group relative bg-card border border-border rounded-xl p-5 cursor-default hover:shadow-elevated hover:-translate-y-1 transition-smooth hover:border-primary/30"
      data-ocid="service-card"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 transition-smooth">
        {icon}
      </div>
      <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
        {description}
      </p>
      {highlight && (
        <span className="mt-3 inline-block text-xs font-display font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {highlight}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-smooth origin-left" />
    </article>
  );
}
