"use server";
import { createUserUseCase } from "@/use-cases/user";
import { createServerAction } from "zsa"
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const createUserAction = createServerAction()
    .input(z.object({
        email: z.string().email(),
        name: z.string()
    }))
    .handler(async ({ input }) => {
        await createUserUseCase(input.email, input.name)
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000))
        revalidatePath("/");
    });