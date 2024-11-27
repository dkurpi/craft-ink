import db from "@/lib/db";
import { TattooFormData, TattooGeneration, TattooStatus } from "@/types/tattoo";

export async function createTattooGeneration(
  data: TattooFormData,
  predictionId: string
) {
  console.log('data', data, predictionId);
  return await db.tattooGeneration.create({
    data: {
      prompt: data.prompt,
      tattooType: data.tattooType,
      style: data.style,
      images: [],
      status: 'pending',
      predictionId
    }
  }) as TattooGeneration;
}


export async function updateTattooGenerationImages(
  id: string,
  images: string[],
  status: TattooStatus
) {
  console.log('data', id, images, status);
  return await db.tattooGeneration.update({
    where: { id },
    data: {
      images,
      status,
    },
  }) as TattooGeneration;
}

export async function getAllTattooGenerations() {
  return await db.tattooGeneration.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  }) as TattooGeneration[];
}
