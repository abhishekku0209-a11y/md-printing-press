import { Link } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const SERVICES = [
  "Offset Printing",
  "Digital Printing",
  "Custom Packaging",
  "Large Format Prints",
  "Project Binding",
  "Business Cards",
  "Flex Banners",
  "Self Ink Stamps",
];

const currentYear = new Date().getFullYear();
const hostname = typeof window !== "undefined" ? window.location.hostname : "";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border" data-ocid="footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/assets/md-printing-logo.jpg"
                alt="MD Printing Press Logo"
                className="h-10 w-auto object-contain rounded-lg"
              />
              <div className="leading-tight">
                <span className="font-display font-bold text-base text-foreground block">
                  MD Printing Press
                </span>
                <span className="text-xs text-muted-foreground font-body">
                  Project Bind Wala
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
              Noida's trusted partner for premium quality printing & finishing
              services since 2005. Your vision printed perfectly.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/917835930876"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service}>
                  <a
                    href="/#services"
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Portfolio", href: "/#portfolio" },
                { label: "Get a Quote", href: "/#quote" },
                { label: "About Us", href: "/#about" },
                { label: "Contact", href: "/#contact" },
                { label: "Admin Login", href: "/admin/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / NAP */}
          <div>
            <h3 className="font-display font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <address className="not-italic text-sm text-muted-foreground font-body leading-relaxed">
                  G-14, Ground Floor, Dharampali Palace,
                  <br />
                  Bhoja Market, Indira Market Road,
                  <br />
                  Atta, Sector 27, Noida, UP 201301
                </address>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="tel:+917835930876"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                >
                  +91 78359 30876
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:info@mdprintingpress.in"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                >
                  info@mdprintingpress.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="https://maps.google.com/?q=Sector+27+Noida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth font-body"
                >
                  View on Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body text-center sm:text-left">
            © {currentYear} MD Printing Press. All rights reserved. | GST:
            09XXXXX1234X1ZX
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
