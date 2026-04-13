import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { CreateServiceInput, Service } from "../types";
import { useBackend } from "./useBackend";

export function useServices() {
  const { actor, isFetching } = useBackend();

  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      return actor.createService(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      console.error("[useCreateService] error:", err);
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: CreateServiceInput }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.updateService(id, input);
      if (!result) throw new Error("Service not found or update failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      console.error("[useUpdateService] error:", err);
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.deleteService(id);
      if (!result) throw new Error("Service not found or delete failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      console.error("[useDeleteService] error:", err);
    },
  });
}
