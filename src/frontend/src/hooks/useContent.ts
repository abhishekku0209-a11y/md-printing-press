import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { ContentBlock } from "../types";
import { useBackend } from "./useBackend";

export function useContentBlocks() {
  const { actor, isFetching } = useBackend();

  return useQuery<ContentBlock[]>({
    queryKey: ["content"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentBlocks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContentBlock(key: string) {
  const { actor, isFetching } = useBackend();

  return useQuery<ContentBlock | null>({
    queryKey: ["content", key],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContentBlock(key);
    },
    enabled: !!actor && !isFetching && !!key,
  });
}

export function useSetContentBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      return actor.setContentBlock(key, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (err) => {
      console.error("[useSetContentBlock] error:", err);
    },
  });
}
