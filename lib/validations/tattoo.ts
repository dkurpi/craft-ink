import { z } from "zod";

export const tattooFormSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters"),
  tattooType: z.enum(['minimal', 'traditional', 'geometric'] as const),
  style: z.enum(['black-and-grey', 'colorful', 'watercolor'] as const)
}); 