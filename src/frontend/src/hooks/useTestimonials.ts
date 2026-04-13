import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import type { CreateTestimonialInput, Testimonial } from "../types";
import { useBackend } from "./useBackend";

export function useTestimonials() {
  const { actor, isFetching } = useBackend();

  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTestimonialInput) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      return actor.createTestimonial(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err) => {
      console.error("[useCreateTestimonial] error:", err);
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: CreateTestimonialInput }) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.updateTestimonial(id, input);
      if (!result) throw new Error("Testimonial not found or update failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err) => {
      console.error("[useUpdateTestimonial] error:", err);
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = queryClient.getQueryData<Backend>(["backend-actor"]);
      if (!actor)
        throw new Error("Backend not ready. Please wait and try again.");
      const result = await actor.deleteTestimonial(id);
      if (!result) throw new Error("Testimonial not found or delete failed.");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err) => {
      console.error("[useDeleteTestimonial] error:", err);
    },
  });
}
