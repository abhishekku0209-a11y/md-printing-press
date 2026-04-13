import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { CreateOrderInput, Order, OrderStatus } from "../types";
import { useBackend } from "./useBackend";

export function useOrders() {
  const { actor, isFetching } = useBackend();

  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor) throw new Error("Actor not available");
      return actor.createOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
