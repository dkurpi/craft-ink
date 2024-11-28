import { TattooGenerator } from "./tattoo-generator";
import { TattooHistory } from "./tattoo-history";

export default function TattooGeneratorPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl px-4 flex flex-col gap-8">
      <TattooGenerator />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
      </div>
      <TattooHistory />
    </div>
  );
}
