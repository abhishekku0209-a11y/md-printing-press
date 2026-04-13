module {
  public type OrderStatus = {
    #Pending;
    #InProgress;
    #Ready;
    #Delivered;
  };

  public type Order = {
    id : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    amount : Float;
    status : OrderStatus;
    quoteId : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CreateOrderInput = {
    clientName : Text;
    serviceType : Text;
    description : Text;
    amount : Float;
    quoteId : ?Nat;
  };
};
