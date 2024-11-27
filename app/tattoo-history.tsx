import { getAllTattooGenerations } from "@/data-access/tattoo";
import { TattooGeneration } from "@/types/tattoo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
export async function TattooHistory() {
  const tattoos = await getAllTattooGenerations();

  return (
    <div >
      <h2 className="text-2xl font-bold mb-4">Previously Generated Tattoos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tattoos.map((tattoo) => (<TattooHistoryItem tattoo={tattoo} />))}
      </div>
    </div>
  );
} 

function TattooHistoryItem({ tattoo }: { tattoo: TattooGeneration }) {
  return (
    <div key={tattoo.id} className="relative aspect-square">
      {tattoo.status !== 'completed' ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg -translate-y-1">
          <LoadingSpinner />
        </div>
      ) : (
        <img
          src={tattoo.images[0]}
          alt={tattoo.prompt}
          className="object-cover w-full h-full rounded-lg"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
        <p className="line-clamp-2">{tattoo.prompt}</p>
        {/* <p className="text-xs text-gray-300">{new Date(tattoo.createdAt).toLocaleDateString()}</p> */}
      </div>
    </div>
  );
}