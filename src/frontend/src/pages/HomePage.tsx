import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { HeroSection } from "@/components/public/HeroSection";
import { PortfolioSection } from "@/components/public/PortfolioSection";
import { QuoteFormSection } from "@/components/public/QuoteFormSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { TrustBadges } from "@/components/public/TrustBadges";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    document.title =
      "MD Printing Press | Project Binding & Printing in Sector 27 Noida";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Premium printing & project binding services in Sector 27 Noida. Same-day delivery, visiting cards, flex banners, self ink stamps. Call +91 7835930876",
    );

    const existingSchema = document.getElementById("local-business-schema");
    if (!existingSchema) {
      const script = document.createElement("script");
      script.id = "local-business-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "MD Printing Press",
        alternateName: "Project Bind Wala",
        description:
          "Premium printing & project binding services in Sector 27 Noida. Same-day delivery available.",
        url: typeof window !== "undefined" ? window.location.origin : "",
        telephone: "+91-7835930876",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "G-14, Ground Floor, Dharampali Palace, Bhoja Market, Indira Market Road, Atta",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          postalCode: "201301",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 28.5706,
          longitude: 77.3272,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday"],
            opens: "10:00",
            closes: "17:00",
          },
        ],
        hasMap: "https://maps.google.com/?q=Dharampali+Palace+Sector+27+Noida",
        priceRange: "₹₹",
      });
      document.head.appendChild(script);
    }

    return () => {
      const schema = document.getElementById("local-business-schema");
      if (schema) document.head.removeChild(schema);
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <TestimonialsSection />
      <QuoteFormSection />
      <ContactSection />
    </main>
  );
}
