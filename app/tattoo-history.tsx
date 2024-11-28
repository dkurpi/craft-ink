import { TattooGeneration } from "@/types/tattoo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAllTattooGenerationsUseCase } from "@/use-cases/tattoo-generation";
import { FallbackImage } from "@/components/fallback-image";
import { RefreshTattoosButton } from "./refresh-tattoos-button";


export async function TattooHistory() {
  const tattoos = await getAllTattooGenerationsUseCase();
  
  return (
    <div >
      <div className="flex items-center gap-4 mb-4 justify-between">
        <h2 className="text-2xl font-bold">Previously Generated Tattoos</h2>
        <RefreshTattoosButton />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tattoos.map((tattoo) => (<TattooHistoryItem key={tattoo.id} tattoo={tattoo as TattooGeneration} />))}
      </div>
    </div>
  );
}


function TattooHistoryItem({ tattoo }: { tattoo: TattooGeneration }) {
  return (
    <div key={tattoo.id} className="relative aspect-square">
      {tattoo.status === 'completed' ? (
        <FallbackImage src={tattoo.images[0]} alt={tattoo.prompt} />
      ) : tattoo.status === 'generating' ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
          <LoadingSpinner color="#9CA3AF" />
        </div>
      ) : (
        <FailedGenerationState />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
        <p className="line-clamp-2">{tattoo.prompt}</p>
      </div>
    </div>
  );
}

function FailedGenerationState() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-red-100 rounded-lg">
      <p className="text-sm text-red-600">Generation failed</p>
    </div>
  );
} 