"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { createDemoUser } from "@/lib/demo";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SandboxWelcomePage() {
  const { push } = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const response = await createDemoUser();

    if (response.error) {
      toast({
        title: response.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    push(`/${response.workspace_id}`);
  };

  return (
    <div className="lg:grid lg:grid-cols-[var(--sidebar-width)_1fr] min-h-dvh">
      <Skeleton className="h-full bg-secondary" />

      <div className="flex flex-col min-h-dvh w-full">
        <Skeleton className="h-[72px] bg-background w-full p-4" />

        <main className="relative flex-grow mx-auto max-w-3xl w-full flex flex-col">
          <Dialog open>
            <DialogContent noCloseButton>
              <DialogTitle>Welcome to Open Sesame!</DialogTitle>
              <p>Click the button to get started!</p>
              <DialogDescription>
                This will create a temporary demo user, access token and
                workspace for you. <br />
                The access token is stored in a cookie. When deleting the
                cookie, you&apos;ll lose access to your demo workspaces and
                conversations and you have to start over.
              </DialogDescription>
              <DialogFooter>
                <Button disabled={isLoading} onClick={handleClick}>
                  {isLoading && (
                    <LoaderCircleIcon className="animate-spin" size={16} />
                  )}
                  Try now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
