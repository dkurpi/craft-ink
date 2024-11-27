import { prisma } from "@/db";
import { User } from "@prisma/client";

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createUser(email: string, name?: string): Promise<User> {
  return await prisma.user.create({
    data: {
      email,
      name,
    },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}