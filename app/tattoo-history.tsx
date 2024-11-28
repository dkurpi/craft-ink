import { TattooGeneration } from "@/types/tattoo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAllTattooGenerationsUseCase } from "@/use-cases/tattoo-generation";


export async function TattooHistory() {
  const tattoos = await getAllTattooGenerationsUseCase();

  return (
    <div >
      <h2 className="text-2xl font-bold mb-4">Previously Generated Tattoos</h2>
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
        <img
          src={tattoo.images[0]}
          alt={tattoo.prompt}
          className="object-cover w-full h-full rounded-lg"
        />
      ) : tattoo.status === 'generating' ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
          <LoadingSpinner color="#9CA3AF" message="Generating your tattoo..." />
        </div>
      ) : (
        // Failed status
        <div className="flex flex-col items-center justify-center w-full h-full bg-red-100 rounded-lg">
          <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-600">Generation failed</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
        <p className="line-clamp-2">{tattoo.prompt}</p>
      </div>
    </div>
  );
}