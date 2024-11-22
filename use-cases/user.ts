"use server";

import { createUser, getUserByEmail } from "@/data-access/user";

export async function createUserUseCase(email: string, name: string) {
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      throw new Error("Email already registered");
    }

    return await createUser(email, name);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Email already registered") {
      throw error;
    }
    // Handle other errors
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("Failed to create user");
  }
}
