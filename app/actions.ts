"use server";

import { createTattooGeneration, setTattooGenerationPrediction, updateTattooGenerationImages } from "@/data-access/tattoo";
import { generateTattooPrompt } from "@/lib/prompts";
import { createServerAction } from "zsa";
import { z } from "zod";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateTattooAction = createServerAction()
  .input(z.object({
    prompt: z.string().min(3),
    tattooType: z.enum(['minimal', 'traditional', 'geometric']),
    style: z.enum(['black-and-grey', 'colorful', 'watercolor'])
  }))
  .handler(async ({ input }) => {
    const finalPrompt = generateTattooPrompt(input);

    const generation = await createTattooGeneration(input);
    revalidatePath('/');

    if (!generation.id) {
      throw new Error('Failed to create tattoo generation');
    }

    const prediction = await replicate.predictions.create({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      input: {
        prompt: finalPrompt,
        width: 768,
        height: 768,
        num_outputs: 1,
        scheduler: "K_EULER",
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    });


    await setTattooGenerationPrediction(generation.id, prediction.id);
    revalidatePath('/');

    return { predictionId: prediction.id, generationId: generation.id };
  });

export const getPredictionStatus = createServerAction()
  .input(z.object({
    predictionId: z.string(),
    generationId: z.string()
  }))
  .handler(async ({ input }) => {
    const prediction = await replicate.predictions.get(input.predictionId);

    if (prediction.status === "succeeded") {
      // Update the tattoo generation with the generated images
      await updateTattooGenerationImages(
        input.generationId,
        prediction.output as string[],
        'completed'
      );
      revalidatePath('/');

      return { status: "succeeded", images: prediction.output };
    }

    if (prediction.status === "failed") {
      await updateTattooGenerationImages(
        input.generationId,
        [],
        'failed'
      );
    }

    revalidatePath('/');

    return { status: prediction.status };
  }); 