import db from "@/lib/db";
import { TattooFormData, TattooStatus } from "@/types/tattoo";

export async function createTattooGeneration(
  data: TattooFormData & { predictionId: string; userId: string }
) {
  return await db.tattooGeneration.create({
    data: {
      prompt: data.prompt,
      tattooType: data.tattooType,
      style: data.style,
      images: [],
      status: 'generating',
      predictionId: data.predictionId,
      userId: data.userId,
    }
  })
}

export async function updateTattooGenerationImagesAndStatus(
  predictionId: string,
  images: string[],
  status: TattooStatus
) {
  const tattoo = await db.tattooGeneration.findFirst({
    where: { predictionId }
  });

  if (!tattoo) {
    throw new Error('Tattoo generation not found');
  }

  return await db.tattooGeneration.update({
    where: { id: tattoo.id },
    data: { images, status }
  });
}

export async function getAllTattooGenerations(userId?: string) {
  const tattoos = await db.tattooGeneration.findMany({
    where: userId ? { userId } : undefined,
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    select: {
      id: true,
      prompt: true,
      images: true,
      status: true,
      user: {
        select: {
          email: true
        }
      }
    }
  });
  return tattoos.map((tattoo) => ({
    id: tattoo.id,
    prompt: tattoo.prompt,
    images: tattoo.images,
    status: tattoo.status,
    userEmail: tattoo.user?.email || ''
  }));  
}

export async function getTattooGenerationById(id: string) {
  return await db.tattooGeneration.findUnique({
    where: { id }
  });
}
