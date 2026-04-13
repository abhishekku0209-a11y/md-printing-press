import { Button } from "@/components/ui/button";
import { useTestimonials } from "@/hooks/useTestimonials";
import type { Testimonial } from "@/types";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1n,
    clientName: "Rahul Sharma",
    businessType: "TechSoft India · IT Services, Sector 16 Noida",
    quote:
      "Got 500 visiting cards in 2 hours. Exceptional quality and speed! MD Printing Press is now our go-to vendor for all corporate printing needs.",
    rating: 5n,
    isVisible: true,
    displayOrder: 1n,
  },
  {
    id: 2n,
    clientName: "Priya Singh",
    businessType: "Sunrise Academy · Coaching Center, Noida",
    quote:
      "Best project binding in Noida, hands down. My students swear by MD Printing Press. Same-day service during exam season is a lifesaver!",
    rating: 5n,
    isVisible: true,
    displayOrder: 2n,
  },
  {
    id: 3n,
    clientName: "Amit Gupta",
    businessType: "GreenBuild Corp · Construction, Greater Noida",
    quote:
      "Ordered flex banners for our construction site. Same-day delivery as promised. Professional quality at very reasonable prices. 10/10!",
    rating: 4n,
    isVisible: true,
    displayOrder: 3n,
  },
  {
    id: 4n,
    clientName: "Neha Verma",
    businessType: "FashionHub · Retail, Sector 18 Noida",
    quote:
      "Stunning brochures at great prices! The team is so friendly and super fast with turnaround. Our entire catalogue was ready the same day.",
    rating: 5n,
    isVisible: true,
    displayOrder: 4n,
  },
  {
    id: 5n,
    clientName: "Vijay Kumar",
    businessType: "ShaktiMotors · Auto Dealership, Noida",
    quote:
      "Self ink stamps made perfectly, exactly what we needed for our dealership documentation. Quick service, professional finish.",
    rating: 5n,
    isVisible: true,
    displayOrder: 5n,
  },
  {
    id: 6n,
    clientName: "Deepa Agarwal",
    businessType: "Blossom School · Educational Institute, Sector 27 Noida",
    quote:
      "Project binding for all our students' assignments. The whole school uses MD Printing! Consistent quality, great pricing for bulk orders.",
    rating: 5n,
    isVisible: true,
    displayOrder: 6n,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => `star-${i}`).map((key, i) => (
        <Star
          key={key}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col gap-4 shadow-subtle">
      <Quote className="w-8 h-8 text-primary/30" />
      <p className="text-foreground font-body leading-relaxed flex-1 text-sm md:text-base">
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
          {testimonial.clientName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm text-foreground truncate">
            {testimonial.clientName}
          </p>
          <p className="text-xs text-muted-foreground font-body truncate">
            {testimonial.businessType}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          <StarRating rating={Number(testimonial.rating)} />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: backendTestimonials, isLoading } = useTestimonials();
  const [mobileIndex, setMobileIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials =
    backendTestimonials && backendTestimonials.length > 0
      ? backendTestimonials
          .filter((t) => t.isVisible)
          .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
      : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    if (!autoplay || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setMobileIndex((i) => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay, testimonials.length]);

  return (
    <section
      id="testimonials"
      className="bg-muted/30 py-16 md:py-24"
      data-ocid="testimonials-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-trust mb-3">Customer Love</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
            Trusted by businesses, schools, and professionals across Noida.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        {!isLoading && (
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={String(t.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile Carousel */}
        {!isLoading && testimonials.length > 0 && (
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                onClick={() => setAutoplay(false)}
              >
                <TestimonialCard testimonial={testimonials[mobileIndex]} />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full"
                onClick={() => {
                  setAutoplay(false);
                  setMobileIndex(
                    (i) => (i - 1 + testimonials.length) % testimonials.length,
                  );
                }}
                aria-label="Previous testimonial"
                data-ocid="testimonial-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1.5">
                {testimonials.map((t, i) => (
                  <button
                    key={`dot-${String(t.id)}`}
                    type="button"
                    className={`w-1.5 h-1.5 rounded-full transition-smooth ${i === mobileIndex ? "bg-primary w-4" : "bg-border"}`}
                    onClick={() => {
                      setAutoplay(false);
                      setMobileIndex(i);
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full"
                onClick={() => {
                  setAutoplay(false);
                  setMobileIndex((i) => (i + 1) % testimonials.length);
                }}
                aria-label="Next testimonial"
                data-ocid="testimonial-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
