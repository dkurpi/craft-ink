"use server";

import { createUser, getUserByEmail, getAllUsers } from "@/data-access/user";
import { User } from "@prisma/client";
import { EmailInUseError } from "./errors";
export async function getUsersUseCase(): Promise<User[]> {
  return await getAllUsers();
}

export async function createUserUseCase(email: string, name: string) {
  // Check if email already exists
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    throw new EmailInUseError();
  }

  await createUser(email, name);
}
