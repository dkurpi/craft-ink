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
  images: string[];
  prompt: string;
  tattooType: TattooType;
  style: TattooStyle;
  status: TattooStatus;
  predictionId?: string;
  createdAt: Date;
} 