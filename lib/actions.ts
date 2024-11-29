import { currentUser } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";
import { User } from "@/types/user";

export const authenticatedAction = createServerActionProcedure()
  .handler(async () => {
    const user = await currentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }
    return {
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName || ''
      }
    } as { user: User };
  });
