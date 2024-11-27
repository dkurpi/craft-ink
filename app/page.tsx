import { TattooGenerator } from "./tattoo-generator";
import { TattooHistory } from "./tattoo-history";

export default function TattooGeneratorPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl px-4 flex flex-col gap-12">
      <TattooGenerator />
      <TattooHistory />
    </div>
  );
}
