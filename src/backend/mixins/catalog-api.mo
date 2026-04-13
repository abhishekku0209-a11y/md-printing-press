import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import CatalogTypes "../types/catalog";
import CatalogLib "../lib/catalog";

mixin (
  services : List.List<CatalogTypes.Service>,
  nextServiceId : { var value : Nat },
  portfolioItems : List.List<CatalogTypes.PortfolioItem>,
  nextPortfolioId : { var value : Nat },
  testimonials : List.List<CatalogTypes.Testimonial>,
  nextTestimonialId : { var value : Nat },
  contentBlocks : Map.Map<Text, CatalogTypes.ContentBlock>,
) {
  // ---- Services (public reads, admin writes) ----

  public query func getServices() : async [CatalogTypes.Service] {
    CatalogLib.getAllServices(services);
  };

  public shared func createService(input : CatalogTypes.CreateServiceInput) : async CatalogTypes.Service {
    let id = nextServiceId.value;
    nextServiceId.value += 1;
    CatalogLib.createService(services, id, input);
  };

  public shared func updateService(id : Nat, input : CatalogTypes.CreateServiceInput) : async Bool {
    CatalogLib.updateService(services, id, input);
  };

  public shared func deleteService(id : Nat) : async Bool {
    CatalogLib.deleteService(services, id);
  };

  // ---- Portfolio (public reads, admin writes) ----

  public query func getPortfolioItems() : async [CatalogTypes.PortfolioItem] {
    CatalogLib.getAllPortfolioItems(portfolioItems);
  };

  public shared func createPortfolioItem(input : CatalogTypes.CreatePortfolioItemInput) : async CatalogTypes.PortfolioItem {
    let id = nextPortfolioId.value;
    nextPortfolioId.value += 1;
    CatalogLib.createPortfolioItem(portfolioItems, id, input);
  };

  public shared func updatePortfolioItem(id : Nat, input : CatalogTypes.CreatePortfolioItemInput) : async Bool {
    CatalogLib.updatePortfolioItem(portfolioItems, id, input);
  };

  public shared func deletePortfolioItem(id : Nat) : async Bool {
    CatalogLib.deletePortfolioItem(portfolioItems, id);
  };

  // ---- Testimonials (public reads, admin writes) ----

  public query func getTestimonials() : async [CatalogTypes.Testimonial] {
    CatalogLib.getAllTestimonials(testimonials);
  };

  public shared func createTestimonial(input : CatalogTypes.CreateTestimonialInput) : async CatalogTypes.Testimonial {
    let id = nextTestimonialId.value;
    nextTestimonialId.value += 1;
    CatalogLib.createTestimonial(testimonials, id, input);
  };

  public shared func updateTestimonial(id : Nat, input : CatalogTypes.CreateTestimonialInput) : async Bool {
    CatalogLib.updateTestimonial(testimonials, id, input);
  };

  public shared func deleteTestimonial(id : Nat) : async Bool {
    CatalogLib.deleteTestimonial(testimonials, id);
  };

  // ---- Content Blocks (public reads, admin writes) ----

  public query func getContentBlocks() : async [CatalogTypes.ContentBlock] {
    CatalogLib.getAllContentBlocks(contentBlocks);
  };

  public query func getContentBlock(key : Text) : async ?CatalogTypes.ContentBlock {
    CatalogLib.getContentBlock(contentBlocks, key);
  };

  public shared func setContentBlock(key : Text, value : Text) : async () {
    CatalogLib.setContentBlock(contentBlocks, key, value, Time.now());
  };
};
