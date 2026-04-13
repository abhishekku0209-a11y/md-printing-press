import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/useServices";
import { motion } from "motion/react";
import { ServiceCard, StaticServiceCard } from "./ServiceCard";

const FALLBACK_SERVICES = [
  {
    icon: "📋",
    name: "Project Report Binding",
    description:
      "Professional spiral, hard cover & soft cover binding for college and MBA project reports. Express same-day service available.",
    highlight: "Same-day binding available",
  },
  {
    icon: "🔖",
    name: "Spiral & Perfect Binding",
    description:
      "High-quality spiral binding for notebooks, reports, and manuals. Perfect binding for catalogs and booklets.",
  },
  {
    icon: "🖊️",
    name: "Self Ink Stamp Maker",
    description:
      "Custom self-inking rubber stamps for offices, schools, banks, and businesses. Ready in 1–2 hours.",
  },
  {
    icon: "🪪",
    name: "Visiting Cards & Letterheads",
    description:
      "Premium business cards with matte, glossy, and UV finishes. Company letterheads and envelopes.",
  },
  {
    icon: "📄",
    name: "Brochures, Flyers & Catalogues",
    description:
      "Full-color offset and digital printing for brochures, flyers, pamphlets and product catalogues.",
  },
  {
    icon: "🖼️",
    name: "Flex Banners & Vinyl Printing",
    description:
      "Vibrant flex banners, vinyl banners, and roll-up standees for events, shops, and exhibitions.",
  },
  {
    icon: "🖨️",
    name: "Digital & Offset Printing",
    description:
      "High-resolution digital and offset printing for all your bulk printing requirements at competitive prices.",
  },
  {
    icon: "💍",
    name: "Wedding & Invitation Cards",
    description:
      "Elegant wedding invitations, event cards, and stationery. Custom designs and premium finishes.",
  },
  {
    icon: "📦",
    name: "Packaging Boxes & Labels",
    description:
      "Custom packaging boxes, product labels, stickers, and hangtags for retail and e-commerce brands.",
  },
  {
    icon: "🛒",
    name: "T-Shirts, Mugs & Promo Items",
    description:
      "Personalized promotional merchandise including custom T-shirts, coffee mugs, and branded gifts.",
  },
];

export function ServicesSection() {
  const { data: services, isLoading } = useServices();
  const hasBackendServices = services && services.length > 0;

  return (
    <section
      id="services"
      className="bg-background py-16 md:py-24"
      data-ocid="services-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-trust mb-3">What We Offer</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            From project binding to flex banners — your one-stop printing
            partner in{" "}
            <span className="text-primary font-medium">Sector 27, Noida</span>.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => `skel-service-${i}`).map(
              (key) => (
                <div key={key} className="rounded-xl p-5 border border-border">
                  <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ),
            )}
          </div>
        ) : hasBackendServices ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {services
              .filter((s) => s.isActive)
              .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
              .map((service, i) => (
                <motion.div
                  key={String(service.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {FALLBACK_SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <StaticServiceCard
                  icon={service.icon}
                  name={service.name}
                  description={service.description}
                  highlight={service.highlight}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
