import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/usePortfolio";
import type { PortfolioItem } from "@/types";
import { motion } from "motion/react";
import { useState } from "react";
import { PortfolioLightbox } from "./PortfolioLightbox";

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1n,
    title: "Project Reports — Spiral Bound",
    serviceCategory: "Project Binding",
    imageUrl: "https://picsum.photos/seed/binding1/600/450",
    displayOrder: 1n,
    isVisible: true,
  },
  {
    id: 2n,
    title: "Business Cards — Matte Finish",
    serviceCategory: "Business Cards",
    imageUrl: "https://picsum.photos/seed/bizcard1/600/450",
    displayOrder: 2n,
    isVisible: true,
  },
  {
    id: 3n,
    title: "Shop Flex Banner",
    serviceCategory: "Flex Banners",
    imageUrl: "https://picsum.photos/seed/banner1/600/450",
    displayOrder: 3n,
    isVisible: true,
  },
  {
    id: 4n,
    title: "Company Brochure — Tri-fold",
    serviceCategory: "Brochures",
    imageUrl: "https://picsum.photos/seed/brochure2/600/450",
    displayOrder: 4n,
    isVisible: true,
  },
  {
    id: 5n,
    title: "Self Ink Office Stamps",
    serviceCategory: "Stamps",
    imageUrl: "https://picsum.photos/seed/stamp1/600/450",
    displayOrder: 5n,
    isVisible: true,
  },
  {
    id: 6n,
    title: "Wedding Invitation Cards",
    serviceCategory: "Wedding Cards",
    imageUrl: "https://picsum.photos/seed/wedding2/600/450",
    displayOrder: 6n,
    isVisible: true,
  },
];

export function PortfolioSection() {
  const { data: items, isLoading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const portfolio =
    items && items.length > 0
      ? items.filter((i) => i.isVisible)
      : FALLBACK_PORTFOLIO;

  const categories = [
    "All",
    ...Array.from(new Set(portfolio.map((i) => i.serviceCategory))),
  ];

  const filtered =
    activeCategory === "All"
      ? portfolio
      : portfolio.filter((i) => i.serviceCategory === activeCategory);

  const sortedFiltered = [...filtered].sort(
    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
  );

  return (
    <section
      id="portfolio"
      className="bg-muted/30 py-16 md:py-24"
      data-ocid="portfolio-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="badge-trust mb-3">Our Work</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            Portfolio Gallery
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            A glimpse of the quality work we deliver every day from our Sector
            27 Noida location.
          </p>
        </motion.div>

        {/* Category filter */}
        {!isLoading && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-display font-medium transition-smooth ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
                data-ocid="portfolio-filter"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }, (_, i) => `skel-portfolio-${i}`).map(
              (key) => (
                <Skeleton key={key} className="aspect-[4/3] rounded-xl" />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedFiltered.map((item, i) => (
              <motion.button
                key={String(item.id)}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setLightboxIndex(i)}
                data-ocid="portfolio-item"
                aria-label={`View ${item.title}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/70 transition-smooth flex items-end p-3">
                  <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-smooth">
                    <p className="font-display font-bold text-white text-sm leading-tight">
                      {item.title}
                    </p>
                    <p className="text-white/80 text-xs font-body">
                      {item.serviceCategory}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {!isLoading && sortedFiltered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body">
            No items in this category yet.
          </div>
        )}

        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            className="font-display font-bold"
            onClick={() => setActiveCategory("All")}
            data-ocid="portfolio-view-all"
          >
            View Full Gallery
          </Button>
        </div>
      </div>

      {lightboxIndex !== null && (
        <PortfolioLightbox
          items={sortedFiltered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null
                ? (prev - 1 + sortedFiltered.length) % sortedFiltered.length
                : 0,
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev + 1) % sortedFiltered.length : 0,
            )
          }
        />
      )}
    </section>
  );
}
