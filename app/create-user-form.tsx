"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUserAction } from "./actions"
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function CreateUserForm() {
  const { toast } = useToast(); 
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    }
  })

  const { isPending, execute } = useServerAction(createUserAction, {
    onSuccess: () => {
      toast({
        title: "User created",
        description: "User has been created successfully",
      })
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: error.err.message
      })
    }
  }); 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => execute({ email: values.email, name: values.name }))} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your name" 
                  {...field} 
                  disabled={isPending} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your.email@example.com" 
                  type="string" 
                  {...field} 
                  disabled={isPending} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  )
}
