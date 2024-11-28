'use client';

import { Button } from "@/components/ui/button";
import { refreshTattoos } from "./actions";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";

export function RefreshTattoosButton() {
  const { toast } = useToast();

  const { execute: refresh, isPending: isRefreshing, reset } = useServerAction(refreshTattoos, {
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Tattoos refreshed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.err.message || "Failed to refresh tattoos",
        variant: "destructive",
      });
    }
  });

  return (
    <Button 
      onClick={() => refresh()} 
      disabled={isRefreshing}
      variant="outline"
      size="sm"
    >
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
} 