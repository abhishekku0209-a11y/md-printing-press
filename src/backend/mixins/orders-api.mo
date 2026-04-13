import List "mo:core/List";
import Time "mo:core/Time";
import OrderTypes "../types/orders";
import OrdersLib "../lib/orders";

mixin (
  orders : List.List<OrderTypes.Order>,
  nextOrderId : { var value : Nat },
) {
  // Admin endpoints — guarded by frontend session after verifyAdminCredentials
  public shared func createOrder(input : OrderTypes.CreateOrderInput) : async OrderTypes.Order {
    let id = nextOrderId.value;
    nextOrderId.value += 1;
    OrdersLib.createOrder(orders, id, input, Time.now());
  };

  public shared func getAllOrders() : async [OrderTypes.Order] {
    OrdersLib.getAllOrders(orders);
  };

  public shared func getOrder(id : Nat) : async ?OrderTypes.Order {
    OrdersLib.getOrder(orders, id);
  };

  public shared func updateOrderStatus(
    id : Nat,
    status : OrderTypes.OrderStatus,
  ) : async Bool {
    OrdersLib.updateOrderStatus(orders, id, status, Time.now());
  };
};
