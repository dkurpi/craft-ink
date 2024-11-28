import db from "@/lib/db";
import { TattooFormData, TattooStatus } from "@/types/tattoo";

export async function createTattooGeneration(
  data: TattooFormData & { predictionId: string }
) {
  return await db.tattooGeneration.create({
    data: {
      prompt: data.prompt,
      tattooType: data.tattooType,
      style: data.style,
      images: [],
      status: 'generating',
      predictionId: data.predictionId,
    }
  })
}

export async function updateTattooGenerationImagesAndStatus(
  generationId: string,
  images: string[],
  status: TattooStatus
){
  return await db.tattooGeneration.update({
    where: { id: generationId },
    data: {
      images,
      status,
    },
  });
}

export async function getAllTattooGenerations() {
  return await db.tattooGeneration.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });
}

export async function getTattooGenerationById(id: string) {
  return await db.tattooGeneration.findUnique({
    where: { id }
  });
}
