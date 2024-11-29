import { User } from "./user";

export type TattooType = 'minimal' | 'traditional' | 'geometric';
export type TattooStyle = 'black-and-grey' | 'colorful' | 'watercolor';
export type TattooStatus = 'generating' | 'completed' | 'failed';

export interface TattooFormData {
  prompt: string;
  tattooType: TattooType;
  style: TattooStyle;
}

export interface TattooGeneration {
  id: string;
  prompt: string;
  images: string[];
  status: string;
  userEmail: string;
  tattooType?: string;
  style?: string;
  createdAt?: Date;
} 