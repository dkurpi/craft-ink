# Project Overview
Create a web app that allows users to create tattoo ideas based on prompts, type of tattoo, and style. The app will use AI to generate tattoo ideas and display them to the user.

You will be using Next.js, Shadcn, TailwindCSS, and TypeScript. 
To generate images, you will be using Replicate, and the model you will be using is stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4. After the images are generated, you will need to save the metadata to the database.
For the database, you will be using Supabase with Prisma as the ORM. 

# Core Functionalities
1. **Tattoo Generator**
   - User can input a prompt, select a type of tattoo, and select a style in a form.
   - After submitting the form, the app will display 4 pictures of tattoo ideas. One big picture of the currently selected tattoo idea and 4 smaller pictures of all tattoo ideas.
   - After submitting the form, the app will have a loading state while the images are being generated, waiting for the response from Replicate.
   - After the images are generated, the app will display the images in a grid.
   - Before submitting the form, the grid will display placeholder images with grayed-out tattoo designs.

2. **Library of Tattoos**
   - User can view all previously generated tattoo ideas in a grid layout.
   - Each generation (set of 4 tattoo images) will be displayed as a card containing:
     - A preview image showing the currently selected tattoo from the set.
     - The other 3 generated images in a smaller size below.
     - The original prompt text used to generate the tattoos.
     - The selected tattoo type (e.g., minimal, traditional, etc.).
     - The chosen tattoo style (e.g., black & grey, colorful, etc.).
     - Timestamp showing when the tattoos were generated.
   - Cards will be sorted with the most recent generations first.
   - User can click any image in a card to view it full-size.

# Documentation

## Replicate Call + Webhooks
- [Replicate Next.js Guide](https://replicate.com/docs/guides/nextjs)
- **Code Example:**
  ```typescript 
  import { NextResponse } from "next/server";
  import Replicate from "replicate";
   
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
   
  // In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
  // In development (on your local machine), the NGROK_HOST environment variable is set.
  const WEBHOOK_HOST = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NGROK_HOST;
   
  export async function POST(request) {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
      );
    }
   
    const { prompt } = await request.json();
   
    const options = {
      version: '8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
    }
   
    if (WEBHOOK_HOST) {
      options.webhook = `${WEBHOOK_HOST}/api/webhooks`
      options.webhook_events_filter = ["start", "completed"]
    }
   
    // A prediction is the result you get when you run a model, including the input, output, and other details
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          width: 768,
          height: 768,
          prompt: prompt + "Tattoo design of a small dog composed of geometric shapes, polygonal art style, vibrant rainbow colors, precise angular lines, sacred geometry elements, modern minimalist approach, symmetrical composition, professional tattoo design, clean crisp linework, high contrast, suitable for tattoo, vector art style",
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50
        },
        ...options
      }
    );
    
    if (output?.error) {
      return NextResponse.json({ detail: output.error }, { status: 500 });
    }
   
    return NextResponse.json(output, { status: 201 });
  }
  ```

- **Receiving Webhook:**
  ```typescript 
  import { NextResponse } from "next/server";
  import Replicate from "replicate";
   
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
   
  export async function GET(request, {params}) {
    const { id } = params;
    const prediction = await replicate.predictions.get(id);
   
    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }
   
    return NextResponse.json(prediction);
  }
  ```

- **Including Metadata in Prediction:**
  ```typescript
  await replicate.predictions.create({
    // ... other options ...
    webhook: `${process.env.WEBSITE_URL}/api/replicate-webhook`,
    webhook_events_filter: ["completed"],
    metadata: {
      prompt: userPrompt,
      tattooType: selectedType,
      style: selectedStyle
    }
  });
  ```

- **Prompt Configuration:**
  ```typescript
  type TattooType = 'minimal' | 'traditional' | 'geometric' | /* other types */;
  type TattooStyle = 'black-and-grey' | 'colorful' | 'watercolor' | /* other styles */;
  
  interface PromptConfig {
    userPrompt: string;
    tattooType: TattooType;
    style: TattooStyle;
  }
  
  function generateTattooPrompt({ userPrompt, tattooType, style }: PromptConfig): string {
    const styleModifiers = {
      'black-and-grey': 'monochromatic, high contrast, black ink',
      'colorful': 'vibrant colors, bold design',
      'watercolor': 'watercolor effect, soft color transitions'
    };
  
    const typeModifiers = {
      'minimal': 'simple lines, minimalist design, clean',
      'traditional': 'bold lines, traditional American tattoo style',
      'geometric': 'geometric patterns, precise lines'
    };
  
    return `
      Tattoo design of ${userPrompt}, 
      ${typeModifiers[tattooType]}, 
      ${styleModifiers[style]}, 
      highly detailed tattoo artwork, 
      professional tattoo design, 
      clean lines
    `.trim().replace(/\s+/g, ' ');
  }
  ```

Example of component with form validation
```typescript
  "use client";
import { LoaderButton } from "@/components/loader-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { schema } from "./validation";
import { createGroupAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon } from "lucide-react";
import { btnIconStyles } from "@/styles/icons";
import { ToggleContext } from "@/components/interactive-overlay";

export function CreateGroupForm() {
  const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(createGroupAction, {
    onStart() {
      preventCloseRef.current = true;
    },
    onFinish() {
      preventCloseRef.current = false;
    },
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        title: "Group Created",
        description: "You can now start managing your events",
      });
      setIsOpen(false);
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          execute(values).then(() => {});
        })}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={7} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton isLoading={isPending}>
          <CheckIcon className={btnIconStyles} /> Create Group
        </LoaderButton>
      </form>
    </Form>
  );
}
```

Example of a server action
```typescript
"use server";

import { rateLimitByKey } from "@/lib/limiter";
import { authenticatedAction } from "@/lib/safe-action";
import { createGroupUseCase } from "@/use-cases/groups";
import { schema } from "./validation";
import { revalidatePath } from "next/cache";

export const createGroupAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(async ({ input: { name, description }, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-create-group`,
    });
    await createGroupUseCase(user, {
      name,
      description,
    });
    revalidatePath("/dashboard");
  });
```

## Project Structure

Project will be structured with layered architecture. There will be data access objects, use cases, and actions:
- **Data Access:**
  - These will be responsible for interacting with the database.  
- **Use Cases:**
  - Will contain the business logic of the application.  
- **Actions:**
  - Are the entry points for the API. They will be responsible for validating the input, calling the use case, and returning the result.
- **Components:**
  - Will be responsible for the UI of the application.
- **App:**
  - Will be responsible for the routing of the application.
- **Lib:**
  - Will be responsible for shared functionality between the different parts of the application.
- **Hooks:**
  - Will be responsible for shared functionality between the different parts of the application.
- **Styles:**
  - Will be responsible for shared styling between the different parts of the application.
- **Utils:**
  - Will be responsible for shared functionality between the different parts of the application.
- **Prisma:**
  - Will be responsible for the database schema and queries.
  - migrations will be stored in the `prisma/migrations` folder.

## Additional Requirements

1. **Project Setup**
   - All new components should go in `/components` at the root (not in the app folder) and be named like `example-component.tsx` unless otherwise specified.
   - All new pages go in `/app`.
   - Use the Next.js 14 app router.
   - All data fetching should be done in a server component and passed down as props.
   - Client components (useState, hooks, etc.) require that `'use client'` is set at the top of the file.

2. **Server-Side API Calls**
   - All interactions with external APIs (e.g., Replicate, OpenAI) should be performed server-side.
   - Create dedicated API routes in the `app/api` directory for each external API interaction.
   - Client-side components should fetch data through these API routes, not directly from external APIs.

3. **Environment Variables**
   - Store all sensitive information (API keys, credentials) in environment variables.
   - Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.
   - For production, set environment variables in the deployment platform (e.g., Vercel).
   - Access environment variables only in server-side code or API routes.

4. **Error Handling and Logging**
   - Implement comprehensive error handling in both client-side components and server-side API routes.
   - Log errors on the server-side for debugging purposes.
   - Display user-friendly error messages on the client-side.

5. **Type Safety**
   - Use TypeScript interfaces for all data structures, especially API responses.
   - Avoid using the `any` type; instead, define proper types for all variables and function parameters.

6. **API Client Initialization**
   - Initialize API clients (e.g., Replicate) in server-side code only.
   - Implement checks to ensure API clients are properly initialized before use.

7. **Data Fetching in Components**
   - Use React hooks (e.g., `useEffect`) for data fetching in client-side components.
   - Implement loading states and error handling for all data fetching operations.

8. **Next.js Configuration**
   - Utilize `next.config.mjs` for environment-specific configurations.
   - Use the `env` property in `next.config.mjs` to make environment variables available to the application.

9. **CORS and API Routes**
   - Use Next.js API routes to avoid CORS issues when interacting with external APIs.
   - Implement proper request validation in API routes.

10. **Component Structure**
    - Separate concerns between client and server components.
    - Use server components for initial data fetching and pass data as props to client components.

11. **Security**
    - Never expose API keys or sensitive credentials on the client-side.
    - Implement proper authentication and authorization for API routes if needed.


