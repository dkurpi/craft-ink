import { TattooRequestForm } from "@/components/form/tattoo-form";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-lg bg-zinc-900">
        <CardContent className="p-6">
          <TattooRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
