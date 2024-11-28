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
import emitter from "@/lib/eventEmitter";
import { ConversationModel } from "@/lib/sesameApi";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  conversations: ConversationModel[];
  workspaceId: string;
}

export default function DeleteConversationModal({
  conversations,
  workspaceId,
}: Props) {
  const { push } = useRouter();
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    const handleDeleteConversation = (cid: string) => setConversationId(cid);
    emitter.on("deleteConversation", handleDeleteConversation);
    return () => {
      emitter.off("deleteConversation", handleDeleteConversation);
    };
  }, []);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleClickDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-conversation", {
        method: "DELETE",
        body: JSON.stringify({
          conversation_id: conversationId,
        }),
      });
      if (response.ok) {
        emitter.emit("updateSidebar");
        emitter.emit("showPageTransitionLoader");
        push(`/${workspaceId}`);
        emitter.emit("updateSidebar");
        setConversationId("");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setConversationId("");
  };

  const conversation = conversations.find(
    (c) => c.conversation_id === conversationId,
  );

  return (
    <Dialog open={Boolean(conversationId)} onOpenChange={handleOpenChange}>
      <DialogContent noCloseButton={isDeleting}>
        <DialogHeader>
          <DialogTitle>Delete conversation</DialogTitle>
          <DialogDescription>
            Do you really want to delete{" "}
            {conversation?.title ? (
              <strong>“{conversation?.title}”</strong>
            ) : (
              "the conversation"
            )}
            ?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isDeleting} variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="gap-2"
              disabled={isDeleting}
              onClick={handleClickDelete}
              variant="destructive"
            >
              {isDeleting && <LoaderCircleIcon className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
