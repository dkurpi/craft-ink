"use client"

import { useState, useEffect } from "react";
import { TattooFormData } from "@/types/tattoo";
import { useToast } from "@/components/ui/use-toast";
import { useServerAction } from "zsa-react";
import { generateTattooAction, getPredictionStatus } from "@/app/actions";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tattooFormSchema } from "@/lib/validations/tattoo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TattooGeneratorFormProps {
  onSubmit: (data: TattooFormData) => Promise<void>;
  isLoading: boolean;
}

export function TattooGenerator() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const { toast } = useToast();

  const { execute: generateTattoo, isPending: isGenerating } = useServerAction(
    generateTattooAction,
    {
      onSuccess: (response) => {
        setPredictionId(response.data.predictionId);
        setGenerationId(response.data.generationId);
      },
      onError: (error) => {
        console.error('error', error.err.message);
        toast({
          title: "Error",
          description: error.err.message || "Failed to start generation",
          variant: "destructive",
        });
      },
    }
  );

  const { execute: checkStatus } = useServerAction(getPredictionStatus, {
    onSuccess: ({data}) => {
      if (data.status === "succeeded" && data.images) {
        setImages(data.images);
        setSelectedIndex(0);
        setPredictionId(null);
        setGenerationId(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.err.message || "Failed to check generation status",
        variant: "destructive",
      });
      setPredictionId(null);
      setGenerationId(null);
    },
  });

  useEffect(() => {
    if (predictionId && generationId) {
      const interval = setInterval(() => {
        checkStatus({ predictionId, generationId });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [predictionId, generationId]);

  const handleSubmit = async (data: TattooFormData) => {
    setImages([]);
    await generateTattoo(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div>
        <TattooGeneratorForm 
          onSubmit={handleSubmit} 
          isLoading={isGenerating || !!predictionId} 
        />
      </div>
      
      <div>
        <TattooGrid
          images={images}
          selectedIndex={selectedIndex}
          onSelectImage={setSelectedIndex}
          isLoading={isGenerating || !!predictionId}
        />
      </div>
    </div>
  );
} 


function TattooGeneratorForm({ onSubmit, isLoading }: TattooGeneratorFormProps) {
  const form = useForm<TattooFormData>({
    resolver: zodResolver(tattooFormSchema),
    defaultValues: {
      prompt: "",
      tattooType: "minimal",
      style: "black-and-grey"
    }
  });

  return (
    <Form {...form}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Generate Your Tattoo</h2>
        <p className="text-muted-foreground">Fill in the details below to create your custom tattoo design.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your tattoo</FormLabel>
              <FormControl>
                <Input placeholder="A small dog with geometric patterns..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tattooType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tattoo Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="geometric">Geometric</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="black-and-grey">Black & Grey</SelectItem>
                  <SelectItem value="colorful">Colorful</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Tattoo"}
        </Button>
      </form>
    </Form>
  );
} 


interface TattooGridProps {
  images: string[];
  selectedIndex: number;
  onSelectImage: (index: number) => void;
  isLoading?: boolean;
}

function TattooGrid({ images, selectedIndex, onSelectImage, isLoading }: TattooGridProps) {
  return (
    <div className="space-y-4">
      {/* Main selected image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
        {isLoading ? (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        ) : images[selectedIndex] ? (
          <Image
            src={images[selectedIndex]}
            alt={`Generated tattoo ${selectedIndex + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image generated</p>
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            className={cn(
              "relative aspect-square rounded-md overflow-hidden border",
              selectedIndex === index && "ring-2 ring-primary"
            )}
          >
            {isLoading ? (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            ) : images[index] ? (
              <Image
                src={images[index]}
                alt={`Generated tattoo ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 