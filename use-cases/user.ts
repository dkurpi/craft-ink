"use server";

import { createUser } from "@/data-access/user";

export async function createUserUseCase(email: string, name: string) {
  return await createUser(email, name);
}
