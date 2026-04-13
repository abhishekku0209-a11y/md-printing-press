import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917835930876?text=Hi%2C%20I%20need%20a%20quote%20for%20printing%20services"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp-float"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-full shadow-elevated hover:shadow-lg hover:scale-105 transition-smooth font-display font-bold text-sm"
    >
      <SiWhatsapp className="w-5 h-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
