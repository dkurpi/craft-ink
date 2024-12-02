"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createTattooGenerationUseCase, getTattooGenerationStatusUseCase, refreshTattoosUseCase } from "@/use-cases/tattoo-generation";
import { authenticatedAction } from "@/lib/actions";
import { getUserCreditsUseCase } from "@/use-cases/credits";

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

export const getTattooGenerationStatus = createServerAction()
  .input(z.string())
  .output(z.object({
    status: z.enum(['generating', 'completed', 'failed']),
    images: z.array(z.string())
  }))
  .handler(async ({input}) => {
    const status = await getTattooGenerationStatusUseCase(input);
    revalidatePath('/');

    return status;
  }); 


export const refreshTattoos = createServerAction()
  .handler(async () => {
    await refreshTattoosUseCase();
    revalidatePath('/');
  });

export const getUserCreditsAction = authenticatedAction
  .createServerAction()
  .output(z.number())
  .handler(async ({ ctx: { user } }) => {
    return await getUserCreditsUseCase(user.id);
  });