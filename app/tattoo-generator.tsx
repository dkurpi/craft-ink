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
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your tattoo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="A small dog with geometric patterns..." 
                  {...field} 
                  disabled={isLoading}
                />
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
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
  const placeholderImages = [
    '/images/placeholder-1.png',
    '/images/placeholder-2.png',
    '/images/placeholder-3.png',
    '/images/placeholder-4.png',
  ];
  
  return (
    <div className="space-y-4">
      {/* Main selected image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <LoadingSpinner message="Creating your unique tattoo design..." color="#9CA3AF"/>
          </div>
        ) : images[selectedIndex] ? (
          <Image
            src={images[selectedIndex]}
            alt={`Generated tattoo ${selectedIndex + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <Image
              src={placeholderImages[0]}
              alt="Placeholder tattoo"
              fill
              className="object-cover blur-[3px] opacity-30"
            />
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.length > 0 ? (
          // Show actual images if available
          images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border",
                selectedIndex === index && "ring-2 ring-primary"
              )}
            >
              <Image
                src={image}
                alt={`Generated tattoo ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))
        ) : (
          // Show 4 placeholder images with loading spinners when no images are available
          placeholderImages.map((placeholderImage, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden border bg-muted"
            >
              {isLoading ? (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <LoadingSpinner color="#9CA3AF" size={18} message="" />
                </div>
              ) : (
                <Image
                  src={placeholderImage}
                  alt="Placeholder tattoo"
                  fill
                  className="object-cover blur-[3px] opacity-30"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 