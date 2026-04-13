import { Button } from "@/components/ui/button";
import { useContentBlocks } from "@/hooks/useContent";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { SiWhatsapp } from "react-icons/si";

export function ContactSection() {
  const { data: blocks } = useContentBlocks();

  const getBlock = (key: string, fallback: string): string => {
    const found = blocks?.find((b) => b.key === key);
    return found?.value ?? fallback;
  };

  const phone = getBlock("contact_phone", "+91 7835930876");
  const email = getBlock("contact_email", "info@mdprintingpress.in");
  const address = getBlock(
    "contact_address",
    "G-14, Ground Floor, Dharampali Palace, Bhoja Market, Indira Market Road, Atta, Sector 27, Noida, UP 201301",
  );
  const businessHours = getBlock(
    "business_hours",
    "Mon–Sat: 9AM–8PM | Sun: 10AM–5PM",
  );

  return (
    <section
      id="contact"
      className="bg-background py-16 md:py-24"
      data-ocid="contact-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-trust mb-3">Find Us</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
            Walk in, call, or WhatsApp us. We're always ready to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            {/* Address */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-subtle transition-smooth">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-foreground mb-1">
                  Our Location
                </p>
                <address className="not-italic text-sm text-muted-foreground font-body leading-relaxed">
                  {address}
                </address>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-subtle transition-smooth">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm text-foreground mb-0.5">
                  Call Us
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                  data-ocid="contact-phone"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-subtle transition-smooth">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm text-foreground mb-0.5">
                  Email Us
                </p>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body truncate block"
                  data-ocid="contact-email"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-subtle transition-smooth">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-foreground mb-0.5">
                  Business Hours
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  {businessHours}
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <Button
              size="lg"
              asChild
              className="w-full font-display font-bold bg-green-500 hover:bg-green-600 text-white transition-smooth"
              data-ocid="contact-whatsapp"
            >
              <a
                href="https://wa.me/917835930876"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiWhatsapp className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </a>
            </Button>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl overflow-hidden border border-border shadow-subtle min-h-[400px]"
          >
            <iframe
              title="MD Printing Press Location — Sector 27 Noida"
              src="https://maps.google.com/maps?q=Dharampali+Palace+Sector+27+Noida&output=embed"
              width="100%"
              height="100%"
              style={{ minHeight: 400, border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-ocid="contact-map"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
