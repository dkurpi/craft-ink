import { createTattooGeneration, getAllTattooGenerations, getTattooGenerationById, updateTattooGenerationImagesAndStatus } from "@/data-access/tattoo";
import { getPredictionStatus, startPrediction } from "@/lib/replicate";
import { TattooFormData } from "@/types/tattoo";
import { generateTattooPrompt } from "@/lib/prompts";
import { TattooStatus } from "@/types/tattoo";


export async function createTattooGenerationUseCase({prompt, tattooType, style}: TattooFormData) {
    const finalPrompt = generateTattooPrompt({prompt, tattooType, style});
    const predictionId = await startPrediction(finalPrompt);
    const generation = await createTattooGeneration({prompt: finalPrompt, tattooType, style, predictionId});
    return generation;
}   

export async function updateTattooGenerationStatusUseCase(
    generationId: string,
): Promise<{ status: TattooStatus; images: string[] }> {
    const generation = await getTattooGenerationById(generationId);
    if (!generation) {
        throw new Error('Tattoo generation not found');
    }   

    if (!generation.predictionId) {
        throw new Error('Prediction ID not found');
    }

    const prediction = await getPredictionStatus(generation.predictionId);
    if (prediction.status === "succeeded" && prediction.output) {
        await updateTattooGenerationImagesAndStatus(
            generationId,
            prediction.output,
            'completed'
        );
        return { status: 'completed', images: prediction.output };

    }

    if (prediction.status === "failed") {
        await updateTattooGenerationImagesAndStatus(
            generationId,
            [],
            'failed'
        );
        return { status: 'failed', images: []};
    }

    return { status: 'generating', images: []};
}

export async function getAllTattooGenerationsUseCase() {
    return await getAllTattooGenerations();
}




