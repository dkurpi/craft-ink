import db from "@/lib/db";

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits. Please purchase more credits to continue.");
    this.name = "InsufficientCreditsError";
  }
}

export async function checkAndDeductCreditsUseCase(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  });

  if (!user || user.credits < 1) {
    throw new InsufficientCreditsError();
  }

  return await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
    select: { credits: true }
  });
}

export async function getUserCreditsUseCase(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  });
  return user?.credits ?? 0;
}

export async function addCreditsToUserUseCase(userId: string, amount: number) {
  return await db.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
    select: { credits: true }
  });
}