"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import emitter from "@/lib/eventEmitter";
import { WorkspaceModel } from "@/lib/sesameApi";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeleteWorkspaceModal() {
  const { push } = useRouter();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceModel | null>(null);

  const handleClickDelete = async () => {
    if (!workspace) return;
    setIsDeleting(true);
    const response = await fetch("/api/delete-workspace", {
      method: "DELETE",
      body: JSON.stringify({
        workspace_id: workspace.workspace_id,
      }),
    });
    if (response.ok) {
      toast({
        title: "Workspace deleted",
      });
      setWorkspace(null);
      emitter.emit("showPageTransitionLoader");
      push(`/workspaces`);
    } else {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleDeleteWorkspace = (workspace: WorkspaceModel) => {
      setIsDeleting(false);
      setWorkspace(workspace);
    };
    emitter.on("deleteWorkspace", handleDeleteWorkspace);
    return () => {
      emitter.off("deleteWorkspace", handleDeleteWorkspace);
    };
  }, []);

  const handleClose = () => {
    setWorkspace(null);
    setIsDeleting(false);
  };

  if (!workspace) return null;

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent noCloseButton={isDeleting}>
        <DialogHeader>
          <DialogTitle>Delete workspace</DialogTitle>
          <DialogDescription>
            Do you really want to delete the workspace &ldquo;
            {workspace.title}&rdquo;?
            <br />
            This will also delete all associated conversations.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={isDeleting}
                onClick={handleClose}
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="gap-2"
              disabled={isDeleting}
              onClick={handleClickDelete}
              variant="destructive"
            >
              {isDeleting && <LoaderCircle className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
