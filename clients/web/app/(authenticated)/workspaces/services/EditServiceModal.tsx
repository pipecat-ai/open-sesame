"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceModel, WorkspaceModel } from "@/lib/sesameApi";
import { LoaderCircleIcon } from "lucide-react";
import { useId, useState } from "react";
import { updateService } from "./actions";

interface Props {
  onClose: () => void;
  onSaved: () => void;
  service: ServiceModel;
  workspaces: WorkspaceModel[];
}

export default function EditServiceModal({
  onClose,
  onSaved,
  service,
  workspaces,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const workspace = workspaces.find(
    (ws) => ws.workspace_id === service.workspace_id,
  );

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(ev.currentTarget);
    const title = formData.get("title");
    const apiKey = formData.get("apiKey");

    const result = await updateService(service.service_id, {
      api_key: apiKey?.toString(),
      title: title?.toString(),
      options: {},
    });

    if (result) {
      onSaved();
      return;
    }

    setError("Failed to update service.");
    setIsSubmitting(false);
  };

  const titleId = useId();
  const apiKeyId = useId();
  const workspaceFormId = useId();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>
              Make changes to this service configuration. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <fieldset>
              <Label htmlFor={titleId}>Title</Label>
              <Input id={titleId} name="title" defaultValue={service.title} />
            </fieldset>

            <fieldset>
              <Label htmlFor={apiKeyId}>API Key</Label>
              <Input
                id={apiKeyId}
                name="apiKey"
                placeholder="Enter here to update"
              />
            </fieldset>

            <fieldset>
              <Label htmlFor={workspaceFormId}>Workspace</Label>
              <Input
                readOnly
                id={workspaceFormId}
                value={workspace?.title ?? "All"}
              />
            </fieldset>

            {error && <p className="text-destructive">{error}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button className="gap-1" disabled={isSubmitting} type="submit">
              {isSubmitting && (
                <LoaderCircleIcon className="animate-spin" size={16} />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
