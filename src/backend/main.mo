import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import QuoteTypes "types/quotes";
import OrderTypes "types/orders";
import CatalogTypes "types/catalog";
import CatalogLib "lib/catalog";
import QuotesApi "mixins/quotes-api";
import OrdersApi "mixins/orders-api";
import CatalogApi "mixins/catalog-api";



actor {
  // Authorization (kept for Internet Identity compatibility, not used for admin login)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage — enables image uploads via the platform storage gateway
  include MixinObjectStorage();

  // Admin credentials — simple id/password authentication
  public query func verifyAdminCredentials(id : Text, password : Text) : async Bool {
    id == "bindwala" and password == "bind@#$"
  };

  // Quotes
  let quotes = List.empty<QuoteTypes.Quote>();
  let nextQuoteId = { var value : Nat = 1 };
  include QuotesApi(quotes, nextQuoteId);

  // Orders
  let orders = List.empty<OrderTypes.Order>();
  let nextOrderId = { var value : Nat = 1 };
  include OrdersApi(orders, nextOrderId);

  // Catalog state
  let services = List.empty<CatalogTypes.Service>();
  let nextServiceId = { var value : Nat = 1 };
  let portfolioItems = List.empty<CatalogTypes.PortfolioItem>();
  let nextPortfolioId = { var value : Nat = 1 };
  let testimonials = List.empty<CatalogTypes.Testimonial>();
  let nextTestimonialId = { var value : Nat = 1 };
  let contentBlocks = Map.empty<Text, CatalogTypes.ContentBlock>();

  include CatalogApi(
    services,
    nextServiceId,
    portfolioItems,
    nextPortfolioId,
    testimonials,
    nextTestimonialId,
    contentBlocks,
  );

  // ── Seed: only on first deploy (when collections are empty) ───────────────
  if (services.size() == 0) {
    let seedServices : [(Text, Text, Text, Nat)] = [
      ("Project Binding", "Professional thesis, report, and book binding using premium materials for a polished finish.", "📚", 1),
      ("Spiral Binding", "Durable spiral binding for notebooks, presentations, and manuals — easy to flip and lay flat.", "🔗", 2),
      ("Self-Inking Stamps", "Custom rubber stamps for offices, clinics, and businesses — fast turnaround, sharp impressions.", "🔏", 3),
      ("Visiting Cards", "Premium business cards with glossy, matte, or UV finish on high-quality cardstock.", "💼", 4),
      ("Brochures & Leaflets", "Eye-catching tri-fold or bi-fold brochures for promotions, events, and product launches.", "📄", 5),
      ("Flex Banners", "Large-format flex printing for hoardings, events, and retail signage with vivid colours.", "🎨", 6),
      ("Digital Printing", "High-resolution digital printing for posters, flyers, and marketing collateral.", "🖨️", 7),
      ("Wedding Cards", "Elegant and customisable wedding invitation cards to match your special day's theme.", "💌", 8),
      ("Packaging & Boxes", "Custom-printed packaging boxes for brands, gifts, and retail products.", "📦", 9),
      ("T-Shirt Printing", "Custom T-shirt printing for corporates, events, and promotions using DTF/screen print.", "👕", 10),
    ];
    for ((name, description, icon, displayOrder) in seedServices.values()) {
      let id = nextServiceId.value;
      nextServiceId.value += 1;
      let _ = CatalogLib.createService(services, id, {
        name;
        description;
        icon;
        imageUrl = null;
        displayOrder;
        isActive = true;
      });
    };
  };

  if (portfolioItems.size() == 0) {
    let seedPortfolio : [(Text, Text, Text)] = [
      ("Thesis Binding — DU Students Batch", "Project Binding", "https://placehold.co/600x400/1e40af/ffffff?text=Thesis+Binding"),
      ("Corporate Stamp Set — Noida IT Firm", "Self-Inking Stamps", "https://placehold.co/600x400/1e40af/ffffff?text=Office+Stamps"),
      ("Wedding Invite — Premium Gold Foil", "Wedding Cards", "https://placehold.co/600x400/1e40af/ffffff?text=Wedding+Cards"),
      ("Retail Banner — Atta Market Shop", "Flex Banners", "https://placehold.co/600x400/1e40af/ffffff?text=Flex+Banner"),
    ];
    for ((title, serviceCategory, imageUrl) in seedPortfolio.values()) {
      let id = nextPortfolioId.value;
      nextPortfolioId.value += 1;
      let _ = CatalogLib.createPortfolioItem(portfolioItems, id, {
        title;
        serviceCategory;
        imageUrl;
        displayOrder = id;
        isVisible = true;
      });
    };
  };

  if (testimonials.size() == 0) {
    let seedTestimonials : [(Text, Text, Text, Nat)] = [
      (
        "Rajesh Sharma",
        "CA Firm, Sector 18 Noida",
        "MD Printing has been printing our CA firm's letterheads and folders for 3 years. Quality is consistent and delivery is always on time. Highly recommended for corporate printing needs.",
        5,
      ),
      (
        "Priya Mehta",
        "Wedding Planner, Noida",
        "We ordered 500 wedding invitations for our client's big day and every card came out perfect. The gold foiling and paper quality were exactly what we wanted. Great value for money!",
        5,
      ),
      (
        "Amit Verma",
        "MBA Student, Amity University",
        "Got my entire dissertation spiral-bound and hard-bound here. Staff is helpful, turnaround was under 2 hours, and the binding quality is excellent. Best place in Sector 27 for students.",
        5,
      ),
      (
        "Sunita Agarwal",
        "Boutique Owner, Atta Market",
        "Ordered flex banners and visiting cards for my new boutique. The colours are vibrant and the banners look very professional. Will definitely order again for my next collection launch.",
        4,
      ),
      (
        "Deepak Nair",
        "IT Manager, Tech Startup Noida",
        "Needed 200 employee ID card holders and custom stamps urgently. MD Printing delivered within the same day. Quick, affordable, and professional — exactly what a startup needs.",
        5,
      ),
      (
        "Kavita Singh",
        "School Principal, Sector 27",
        "We get all our school stationery, report card covers, and event brochures printed here. Bulk orders are handled efficiently and pricing is very reasonable for institutions.",
        4,
      ),
    ];
    var order : Nat = 1;
    for ((clientName, businessType, quote, rating) in seedTestimonials.values()) {
      let id = nextTestimonialId.value;
      nextTestimonialId.value += 1;
      let _ = CatalogLib.createTestimonial(testimonials, id, {
        clientName;
        businessType;
        quote;
        rating;
        isVisible = true;
        displayOrder = order;
      });
      order += 1;
    };
  };

  if (contentBlocks.size() == 0) {
    let seedContent : [(Text, Text)] = [
      ("hero_headline", "Noida's Trusted Printing & Binding Experts"),
      ("hero_subtext", "Premium quality printing, binding, stamps, banners, and more — delivered fast in Sector 27, Noida. Serving students, businesses, and events since 2005."),
      ("about_text", "MD Printing Press (Project Bind Wala) is a full-service printing and binding shop located in the heart of Sector 27, Noida. We specialise in thesis binding, self-inking stamps, visiting cards, flex banners, wedding cards, and all types of digital printing. Our commitment to quality and same-day service has made us the go-to printing partner for thousands of students, professionals, and businesses across Noida and Greater Noida."),
      ("business_hours", "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 5:00 PM"),
      ("contact_phone", "+91 7835930876"),
      ("contact_email", "mdprintingpress27@gmail.com"),
      ("contact_address", "G-14, Ground Floor, Dharampali Palace, Bhoja Market, Indira Market Road, Atta, Sector 27, Noida, UP 201301"),
    ];
    for ((key, value) in seedContent.values()) {
      CatalogLib.setContentBlock(contentBlocks, key, value, 0);
    };
  };
};
