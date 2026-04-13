import { Button } from "@/components/ui/button";
import { useContentBlocks } from "@/hooks/useContent";
import { cn } from "@/lib/utils";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  const { data: blocks } = useContentBlocks();

  const getBlock = (key: string, fallback: string): string => {
    const found = blocks?.find((b) => b.key === key);
    return found?.value ?? fallback;
  };

  const headline = getBlock(
    "hero_headline",
    "Premium Printing & Project Binding in Noida",
  );
  const subtext = getBlock(
    "hero_subtext",
    "Fast turnaround • Quality guaranteed • Sector 27, Noida",
  );

  const scrollToQuote = () => {
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.25 0.18 261) 0%, oklch(0.35 0.21 261) 50%, oklch(0.28 0.15 280) 100%)",
      }}
      data-ocid="hero-section"
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.8 0.2 60) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.15 135) 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-body text-white/90 font-medium">
                Open Now — Same Day Delivery Available
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl leading-tight text-white">
              {headline}
            </h1>

            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed">
              {subtext}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="font-display font-bold text-base bg-white hover:bg-white/95 text-[oklch(0.3_0.2_261)] shadow-elevated hover:shadow-lg transition-smooth"
                onClick={scrollToQuote}
                data-ocid="hero-cta-quote"
              >
                Get Instant Quote
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                asChild
                className={cn(
                  "font-display font-bold text-base border-2 border-white/30",
                  "bg-green-500 hover:bg-green-600 text-white shadow-elevated transition-smooth",
                )}
                data-ocid="hero-cta-whatsapp"
              >
                <a
                  href="https://wa.me/917835930876"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Now
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {[
                "📍 Sector 27, Noida",
                "⚡ 2-Hour Express Service",
                "✅ 5000+ Happy Clients",
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-sm text-white/70 font-body flex items-center gap-1.5"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-2xl opacity-20 blur-3xl bg-white" />
              <img
                src="/assets/generated/hero-printing-press.dim_800x600.png"
                alt="MD Printing Press — Premium Printing Services in Noida"
                className="relative w-full h-auto drop-shadow-2xl rounded-xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-background"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
