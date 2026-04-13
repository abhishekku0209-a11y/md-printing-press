import List "mo:core/List";
import Map "mo:core/Map";
import Types "../types/catalog";

module {
  // Services
  public func createService(
    services : List.List<Types.Service>,
    nextId : Nat,
    input : Types.CreateServiceInput,
  ) : Types.Service {
    let s : Types.Service = {
      id = nextId;
      name = input.name;
      description = input.description;
      icon = input.icon;
      imageUrl = input.imageUrl;
      displayOrder = input.displayOrder;
      isActive = input.isActive;
    };
    services.add(s);
    s;
  };

  public func getAllServices(services : List.List<Types.Service>) : [Types.Service] {
    services.toArray();
  };

  public func getService(services : List.List<Types.Service>, id : Nat) : ?Types.Service {
    services.find(func(s) { s.id == id });
  };

  public func updateService(
    services : List.List<Types.Service>,
    id : Nat,
    input : Types.CreateServiceInput,
  ) : Bool {
    var found = false;
    services.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        { s with
          name = input.name;
          description = input.description;
          icon = input.icon;
          imageUrl = input.imageUrl;
          displayOrder = input.displayOrder;
          isActive = input.isActive;
        };
      } else { s };
    });
    found;
  };

  public func deleteService(services : List.List<Types.Service>, id : Nat) : Bool {
    let sizeBefore = services.size();
    let kept = services.filter(func(s) { s.id != id });
    services.clear();
    services.append(kept);
    services.size() < sizeBefore;
  };

  // Portfolio
  public func createPortfolioItem(
    items : List.List<Types.PortfolioItem>,
    nextId : Nat,
    input : Types.CreatePortfolioItemInput,
  ) : Types.PortfolioItem {
    let item : Types.PortfolioItem = {
      id = nextId;
      title = input.title;
      serviceCategory = input.serviceCategory;
      imageUrl = input.imageUrl;
      displayOrder = input.displayOrder;
      isVisible = input.isVisible;
    };
    items.add(item);
    item;
  };

  public func getAllPortfolioItems(items : List.List<Types.PortfolioItem>) : [Types.PortfolioItem] {
    items.toArray();
  };

  public func getPortfolioItem(items : List.List<Types.PortfolioItem>, id : Nat) : ?Types.PortfolioItem {
    items.find(func(p) { p.id == id });
  };

  public func updatePortfolioItem(
    items : List.List<Types.PortfolioItem>,
    id : Nat,
    input : Types.CreatePortfolioItemInput,
  ) : Bool {
    var found = false;
    items.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with
          title = input.title;
          serviceCategory = input.serviceCategory;
          imageUrl = input.imageUrl;
          displayOrder = input.displayOrder;
          isVisible = input.isVisible;
        };
      } else { p };
    });
    found;
  };

  public func deletePortfolioItem(items : List.List<Types.PortfolioItem>, id : Nat) : Bool {
    let sizeBefore = items.size();
    let kept = items.filter(func(p) { p.id != id });
    items.clear();
    items.append(kept);
    items.size() < sizeBefore;
  };

  // Testimonials
  public func createTestimonial(
    testimonials : List.List<Types.Testimonial>,
    nextId : Nat,
    input : Types.CreateTestimonialInput,
  ) : Types.Testimonial {
    let t : Types.Testimonial = {
      id = nextId;
      clientName = input.clientName;
      businessType = input.businessType;
      quote = input.quote;
      rating = input.rating;
      isVisible = input.isVisible;
      displayOrder = input.displayOrder;
    };
    testimonials.add(t);
    t;
  };

  public func getAllTestimonials(testimonials : List.List<Types.Testimonial>) : [Types.Testimonial] {
    testimonials.toArray();
  };

  public func getTestimonial(testimonials : List.List<Types.Testimonial>, id : Nat) : ?Types.Testimonial {
    testimonials.find(func(t) { t.id == id });
  };

  public func updateTestimonial(
    testimonials : List.List<Types.Testimonial>,
    id : Nat,
    input : Types.CreateTestimonialInput,
  ) : Bool {
    var found = false;
    testimonials.mapInPlace(func(t) {
      if (t.id == id) {
        found := true;
        { t with
          clientName = input.clientName;
          businessType = input.businessType;
          quote = input.quote;
          rating = input.rating;
          isVisible = input.isVisible;
          displayOrder = input.displayOrder;
        };
      } else { t };
    });
    found;
  };

  public func deleteTestimonial(testimonials : List.List<Types.Testimonial>, id : Nat) : Bool {
    let sizeBefore = testimonials.size();
    let kept = testimonials.filter(func(t) { t.id != id });
    testimonials.clear();
    testimonials.append(kept);
    testimonials.size() < sizeBefore;
  };

  // Content blocks
  public func setContentBlock(
    content : Map.Map<Text, Types.ContentBlock>,
    key : Text,
    value : Text,
    now : Int,
  ) {
    content.remove(key);
    content.add(key, { key; value; updatedAt = now });
  };

  public func getContentBlock(
    content : Map.Map<Text, Types.ContentBlock>,
    key : Text,
  ) : ?Types.ContentBlock {
    content.get(key);
  };

  public func getAllContentBlocks(content : Map.Map<Text, Types.ContentBlock>) : [Types.ContentBlock] {
    content.values().toArray();
  };
};
