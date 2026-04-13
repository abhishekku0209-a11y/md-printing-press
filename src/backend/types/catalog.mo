module {
  public type Service = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
    imageUrl : ?Text;
    displayOrder : Nat;
    isActive : Bool;
  };

  public type CreateServiceInput = {
    name : Text;
    description : Text;
    icon : Text;
    imageUrl : ?Text;
    displayOrder : Nat;
    isActive : Bool;
  };

  public type PortfolioItem = {
    id : Nat;
    title : Text;
    serviceCategory : Text;
    imageUrl : Text;
    displayOrder : Nat;
    isVisible : Bool;
  };

  public type CreatePortfolioItemInput = {
    title : Text;
    serviceCategory : Text;
    imageUrl : Text;
    displayOrder : Nat;
    isVisible : Bool;
  };

  public type Testimonial = {
    id : Nat;
    clientName : Text;
    businessType : Text;
    quote : Text;
    rating : Nat;
    isVisible : Bool;
    displayOrder : Nat;
  };

  public type CreateTestimonialInput = {
    clientName : Text;
    businessType : Text;
    quote : Text;
    rating : Nat;
    isVisible : Bool;
    displayOrder : Nat;
  };

  public type ContentBlock = {
    key : Text;
    value : Text;
    updatedAt : Int;
  };
};
