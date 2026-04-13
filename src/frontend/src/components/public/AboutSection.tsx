import { useContentBlocks } from "@/hooks/useContent";
import { Award, MapPin, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { icon: Award, value: "10+", label: "Years Serving Noida" },
  { icon: Users, value: "5000+", label: "Happy Clients" },
  { icon: Zap, value: "2hr", label: "Express Service" },
];

export function AboutSection() {
  const { data: blocks } = useContentBlocks();

  const getBlock = (key: string, fallback: string): string => {
    const found = blocks?.find((b) => b.key === key);
    return found?.value ?? fallback;
  };

  const aboutText = getBlock(
    "about_text",
    "MD Printing Press has been Noida's most trusted printing partner for over a decade. Located in the heart of Sector 27, we provide everything from same-day project binding for college students to large-format flex banners for businesses. Our state-of-the-art printing technology, experienced team, and commitment to quality have made us the go-to printing press in the region.",
  );

  return (
    <section
      id="about"
      className="bg-background py-16 md:py-24"
      data-ocid="about-section"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-trust mb-3">Who We Are</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-6">
              Noida's Trusted Printing Partner Since 2005
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              {aboutText}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10"
                  >
                    <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="font-display font-bold text-xl text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground font-body leading-snug mt-0.5">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Address highlight */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-display font-bold text-sm text-foreground mb-0.5">
                  Visit Us in Sector 27, Noida
                </p>
                <address className="not-italic text-sm text-muted-foreground font-body leading-relaxed">
                  G-14, Ground Floor, Dharampali Palace, Bhoja Market,
                  <br />
                  Indira Market Road, Atta, Sector 27, Noida, UP 201301
                </address>
              </div>
            </div>
          </motion.div>

          {/* Image / visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-primary/5">
              <img
                src="https://picsum.photos/seed/printing-office/600/500"
                alt="MD Printing Press shop interior"
                loading="lazy"
                className="w-full h-80 lg:h-96 object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elevated">
                  <p className="font-display font-bold text-sm text-foreground mb-1">
                    Open 7 Days a Week
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Mon–Sat: 9AM–8PM &nbsp;|&nbsp; Sun: 10AM–5PM
                  </p>
                </div>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-elevated hidden lg:block">
              <p className="font-display font-bold text-2xl">100%</p>
              <p className="text-xs font-body opacity-90">Quality Guaranteed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
