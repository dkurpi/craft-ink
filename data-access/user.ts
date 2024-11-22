import { prisma } from "@/db";

export async function createUser(email: string, name: string ) {
    return await prisma.user.create({
      data: {
        email,
        name,
      },
    });
} 

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Failed to check email existence");
  }
}