"use server";

import { createUserUseCase } from "@/use-cases/user";
import { createServerAction } from "zsa"
import { z } from "zod";

export const createUserAction = createServerAction() 
    .input(z.object({
        email: z.string().email(),
        name: z.string()
    }))
    .output(z.object({
        success: z.boolean()
    }))
    .handler(async ({ input }) => {
        await createUserUseCase(input.email, input.name)
        // Sleep for .5 seconds
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { success: true }
    });
