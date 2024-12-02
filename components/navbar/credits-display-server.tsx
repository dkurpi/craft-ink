import { Badge } from "@/components/ui/badge";
import { getUserCreditsUseCase } from "@/use-cases/credits";
import { currentUser } from "@clerk/nextjs/server";

export async function CreditsDisplay() {
  const user = await currentUser();
  if (!user) return null;
  
  const credits = await getUserCreditsUseCase(user.id);
  if (credits === null || credits === undefined) return null;

  return (
    <Badge className="text-white font-medium px-2 rounded-lg shadow-xl cursor-pointer">
      {credits} {credits === 1 ? 'credit' : 'credits'}
    </Badge>
  );
} 