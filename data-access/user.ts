import { prisma } from "@/db";

export async function createUser(email: string, name: string ) {
    return await prisma.user.create({
      data: {
        email,
        name,
      },
    });
} 