"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Share2, Dice1Icon as Dice, Crown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import Image from "next/image"

// Define the form schema with Zod
const formSchema = z.object({
  tattooIdea: z.string().min(3, {
    message: "Tattoo idea must be at least 3 characters.",
  }),
  style: z.enum(["black-and-grey", "traditional", "realistic", "tribal"], {
    required_error: "Please select a style.",
  }),
  placement: z.enum(["square", "rectangle", "circle"], {
    required_error: "Please select a placement.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function TattooGenerator() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tattooIdea: "",
      style: "black-and-grey",
      placement: "square",
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
    // Handle form submission
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-5xl mx-auto">
      {/* Left Column - Controls */}
      <div className="w-full lg:w-72 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">CREDITS LEFT: 4 / 6</div>
            <Button variant="outline" size="sm">UPGRADE</Button>
          </div>
          <Progress value={66} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="tattooIdea"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-muted-foreground">Tattoo Idea</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="Skull and Roses" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Dice className="h-4 w-4" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-muted-foreground">Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-and-grey">Black and Grey</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="tribal">Tribal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placement"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-muted-foreground">Body Part / Placement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Button type="button" className="w-full relative">
                <Crown className="w-4 h-4 mr-2" />
                CUSTOM SHAPE
                <Badge variant="secondary" className="absolute right-2">NEW</Badge>
              </Button>
            </div>

            <div className="space-y-2">
              <Button type="button" variant="outline" className="w-full justify-between">
                Advanced Options
                <Badge variant="secondary">Pro Only</Badge>
              </Button>
            </div>

            <Button type="submit" className="w-full" size="lg">
              CREATE
            </Button>
          </form>
        </Form>
      </div>

      {/* Right Column - Preview */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <Card className="border-2 border-dashed">
          <CardContent className="aspect-[4/3] relative p-0">
            <Image
              src="/placeholder.svg"
              alt="Generated tattoo design"
              width={800}
              height={600}
              className="w-full h-full object-contain"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="aspect-[4/3]">
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg"
                  alt={`Thumbnail ${i}`}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
