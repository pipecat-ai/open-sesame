"use client";

import PageTransitionLink from "@/components/PageTransitionLink";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import emitter from "@/lib/eventEmitter";
import { ConversationModel } from "@/lib/sesameApi";
import { cn } from "@/lib/utils";
import { CheckIcon, EllipsisIcon, LoaderCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  conversation: ConversationModel;
  onClick: () => void;
  workspaceId: string;
}

export default function ConversationListItem({
  conversation,
  onClick,
  workspaceId,
}: Props) {
  const { refresh } = useRouter();
  const pathname = usePathname();

  const isActive =
    pathname === `/${workspaceId}/c/${conversation.conversation_id}`;

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);
  const [title, setTitle] = useState(conversation.title ?? "Conversation");

  const handleEditSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const title = formData.get("title")?.toString()?.trim();

    if (!title) {
      return;
    }

    if (title === conversation.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("/api/update-conversation", {
        method: "PUT",
        body: JSON.stringify({
          conversation_id: conversation.conversation_id,
          title,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        setIsUpdating(false);
        setTitle(title);
        refresh();
        emitter.emit("updateSidebar");
      }
    } catch {
      setUpdateFailed(true);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!updateFailed) return;
    const timeout = setTimeout(() => {
      setUpdateFailed(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [updateFailed]);

  const handleClickEdit = () => setIsEditing(true);

  const handleClickDelete = () => {
    emitter.emit("deleteConversation", conversation.conversation_id);
  };

  return (
    <li
      key={conversation.conversation_id}
      className={cn(
        "relative group rounded-lg transition-colors flex items-center justify-between",
        {
          "bg-secondary-foreground/[.05] font-medium": isActive,
          "hover:bg-input": !isEditing,
        },
      )}
    >
      {isEditing ? (
        <form className="flex-grow" onSubmit={handleEditSubmit}>
          <Input
            autoFocus
            className="bg-background border-none block text-base h-auto px-3 py-2"
            defaultValue={conversation.title ?? ""}
            name="title"
            pattern="[^\s].+"
            placeholder="Conversation title"
            required
            readOnly={isUpdating}
            title="Please enter a title (no spaces or tabs allowed)"
          />
          <TooltipProvider>
            <Tooltip open={updateFailed}>
              <TooltipTrigger asChild>
                <Button
                  className="absolute top-1/2 -translate-y-1/2 right-1"
                  disabled={isUpdating}
                  size="icon"
                  type="submit"
                  variant="ghost"
                >
                  {isUpdating ? (
                    <LoaderCircleIcon className="animate-spin" size={16} />
                  ) : (
                    <CheckIcon size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-destructive text-destructive-foreground">
                Updating the title failed
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      ) : (
        <>
          <PageTransitionLink
            href={`/${workspaceId}/c/${conversation.conversation_id}`}
            className="text-base flex-grow px-3 py-2 text-ellipsis text-nowrap overflow-hidden w-full focus-visible:outline-primary focus-visible:outline-1"
            onClick={onClick}
          >
            {title}
          </PageTransitionLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "shrink-0 text-foreground/50 group-hover:visible group-focus-within:visible aria-expanded:visible hover:bg-transparent hover:text-foreground",
                  {
                    invisible: !isActive,
                  },
                )}
                size="icon"
                variant="ghost"
              >
                <EllipsisIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClickEdit}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleClickDelete}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </li>
  );
}
