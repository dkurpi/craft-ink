import { CreateUserForm } from "./create-user-form";
import { Card, CardContent } from "@/components/ui/card";
import { UserTable } from "./user-table";

export default function Home() {
  return (
    <div className="flex items-start justify-center gap-8 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-md bg-zinc-900">
        <CardContent className="p-6">
          <CreateUserForm />
        </CardContent>
      </Card>
      <UserTable />
    </div>
  );
}
