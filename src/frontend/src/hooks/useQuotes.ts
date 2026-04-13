import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { CreateQuoteInput, Quote, QuoteStatus } from "../types";
import { useBackend } from "./useBackend";

export function useQuotes() {
  const { actor, isFetching } = useBackend();

  return useQuery<Quote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateQuoteInput) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor) throw new Error("Actor not available");
      return actor.createQuote(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: QuoteStatus }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor) throw new Error("Actor not available");
      return actor.updateQuoteStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}
