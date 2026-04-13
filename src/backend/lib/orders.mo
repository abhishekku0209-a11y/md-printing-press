import List "mo:core/List";
import Types "../types/orders";

module {
  public func createOrder(
    orders : List.List<Types.Order>,
    nextId : Nat,
    input : Types.CreateOrderInput,
    now : Int,
  ) : Types.Order {
    let o : Types.Order = {
      id = nextId;
      clientName = input.clientName;
      serviceType = input.serviceType;
      description = input.description;
      amount = input.amount;
      status = #Pending;
      quoteId = input.quoteId;
      createdAt = now;
      updatedAt = now;
    };
    orders.add(o);
    o;
  };

  public func getAllOrders(orders : List.List<Types.Order>) : [Types.Order] {
    orders.toArray();
  };

  public func getOrder(orders : List.List<Types.Order>, id : Nat) : ?Types.Order {
    orders.find(func(o) { o.id == id });
  };

  public func updateOrderStatus(
    orders : List.List<Types.Order>,
    id : Nat,
    status : Types.OrderStatus,
    now : Int,
  ) : Bool {
    var found = false;
    orders.mapInPlace(func(o) {
      if (o.id == id) {
        found := true;
        { o with status; updatedAt = now };
      } else { o };
    });
    found;
  };
};
