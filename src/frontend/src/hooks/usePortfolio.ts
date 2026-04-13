import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { CreatePortfolioItemInput, PortfolioItem } from "../types";
import { useBackend } from "./useBackend";

export function usePortfolio() {
  const { actor, isFetching } = useBackend();

  return useQuery<PortfolioItem[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolioItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePortfolioItemInput) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      return actor.createPortfolioItem(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err) => {
      console.error("[useCreatePortfolioItem] error:", err);
    },
  });
}

export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: CreatePortfolioItemInput }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.updatePortfolioItem(id, input);
      if (!result)
        throw new Error("Portfolio item not found or update failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err) => {
      console.error("[useUpdatePortfolioItem] error:", err);
    },
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.deletePortfolioItem(id);
      if (!result)
        throw new Error("Portfolio item not found or delete failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err) => {
      console.error("[useDeletePortfolioItem] error:", err);
    },
  });
}
