"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createTattooGenerationUseCase, refreshTattoosUseCase, updateTattooGenerationStatusUseCase } from "@/use-cases/tattoo-generation";
import { authenticatedAction } from "@/lib/actions";

export const generateTattooAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    prompt: z.string().min(3),
    tattooType: z.enum(['minimal', 'traditional', 'geometric']),
    style: z.enum(['black-and-grey', 'colorful', 'watercolor'])
  }))
  .output(z.object({
    generationId: z.string()
  })) 
  .handler(async ({ input, ctx: { user } }) => {
    const generation = await createTattooGenerationUseCase(user.id, input);
    revalidatePath('/');
    return { generationId: generation.id };
  });

export const updateTattooGenerationStatus = createServerAction()
  .input(z.string())
  .output(z.object({
    status: z.enum(['generating', 'completed', 'failed']),
    images: z.array(z.string())
  }))
  .handler(async ({input}) => {
    const status = await updateTattooGenerationStatusUseCase(input);
    revalidatePath('/');

    return status;
  }); 


export const refreshTattoos = createServerAction()
  .handler(async () => {
    await refreshTattoosUseCase();
    revalidatePath('/');
  });