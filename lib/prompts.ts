import { TattooFormData } from "@/types/tattoo";

const styleModifiers = {
  'black-and-grey': 'monochromatic, high contrast, black ink',
  'colorful': 'vibrant colors, bold design',
  'watercolor': 'watercolor effect, soft color transitions'
} as const;

const typeModifiers = {
  'minimal': 'simple lines, minimalist design, clean',
  'traditional': 'bold lines, traditional American tattoo style',
  'geometric': 'geometric patterns, precise lines'
} as const;

export function generateTattooPrompt({ prompt, tattooType, style }: TattooFormData): string {
  return `
    Tattoo design of ${prompt}, 
    ${typeModifiers[tattooType]}, 
    ${styleModifiers[style]}, 
    highly detailed tattoo artwork, 
    professional tattoo design, 
    clean lines
  `.trim().replace(/\s+/g, ' ');
} 