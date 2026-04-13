import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Get Quote", href: "/#quote" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle"
      data-ocid="navbar"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="nav-logo"
        >
          <img
            src="/assets/md-printing-logo.jpg"
            alt="MD Printing Press Logo"
            className="h-10 w-auto object-contain rounded-lg"
          />
          <div className="leading-tight">
            <span className="font-display font-bold text-lg text-foreground block">
              MD Printing Press
            </span>
            <span className="text-xs text-muted-foreground font-body">
              Project Bind Wala
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          data-ocid="nav-links"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="px-3 py-2 text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-smooth"
              onClick={(e) => {
                if (isHome && link.href.startsWith("/#")) {
                  e.preventDefault();
                  const id = link.href.slice(2);
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+917835930876"
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-smooth"
            data-ocid="nav-phone"
          >
            <Phone className="w-4 h-4" />
            <span>+91 78359 30876</span>
          </a>
          <Button
            asChild
            size="sm"
            className="font-display font-bold"
            data-ocid="nav-cta"
          >
            <a
              href={isHome ? "#quote" : "/#quote"}
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  document
                    .getElementById("quote")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Free Quote
            </a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground hover:bg-muted/50 transition-smooth"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          data-ocid="nav-mobile-toggle"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden border-t border-border bg-card overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted/50 rounded-md transition-smooth"
              onClick={(e) => {
                setMenuOpen(false);
                if (isHome && link.href.startsWith("/#")) {
                  e.preventDefault();
                  const id = link.href.slice(2);
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-border mt-1">
            <a
              href="tel:+917835930876"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted/50 rounded-md transition-smooth"
            >
              <Phone className="w-4 h-4 text-primary" />
              +91 78359 30876
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
