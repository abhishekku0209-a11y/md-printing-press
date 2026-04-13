import { Clock, Palette, Shield, Star } from "lucide-react";
import { motion } from "motion/react";

const BADGES = [
  {
    icon: Clock,
    title: "Same-Day Delivery",
    subtitle: "In Noida & nearby areas",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Palette,
    title: "Free Design Help",
    subtitle: "Consultation included",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    subtitle: "Or we reprint for free",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Star,
    title: "10+ Years Experience",
    subtitle: "Trusted by 5000+ clients",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function TrustBadges() {
  return (
    <section
      className="bg-card border-b border-border py-8"
      data-ocid="trust-badges"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-smooth"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${badge.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${badge.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm text-foreground truncate">
                    {badge.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-body truncate">
                    {badge.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
