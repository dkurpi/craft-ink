import db from "@/lib/db";
import { TattooFormData, TattooGeneration, TattooStatus } from "@/types/tattoo";
import { Prisma } from "@prisma/client";

export async function createTattooGeneration(
  data: TattooFormData
): Promise<Prisma.TattooGenerationCreateInput> {
  return await db.tattooGeneration.create({
    data: {
      prompt: data.prompt,
      tattooType: data.tattooType,
      style: data.style,
      images: [],
      status: 'generating',
    }
  })
}

export async function setTattooGenerationPrediction(
  id: string,
  predictionId: string
): Promise<Prisma.TattooGenerationUpdateInput> {
  return await db.tattooGeneration.update({
    where: { id },
    data: {
      predictionId
    }
  });
}

export async function updateTattooGenerationImages(
  id: string,
  images: string[],
  status: TattooStatus
): Promise<Prisma.TattooGenerationUpdateInput> {
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
