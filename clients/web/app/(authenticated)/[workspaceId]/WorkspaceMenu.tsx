"use client";

import PageTransitionLink from "@/components/PageTransitionLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import emitter from "@/lib/eventEmitter";
import { WorkspaceModel } from "@/lib/sesameApi";
import { BoxIcon, CheckIcon, LayoutGridIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkspaceMenuProps {
  className: string;
  onSwitchWorkspace?: () => void;
  workspace?: WorkspaceModel | null;
  workspaces?: WorkspaceModel[];
}

const WorkspaceMenu = ({
  className,
  onSwitchWorkspace,
  workspace,
  workspaces = [],
}: WorkspaceMenuProps) => {
  const { push } = useRouter();
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger className="group rounded-full flex gap-2 items-center w-full hover:bg-secondary-foreground/[.05] focus-visible:bg-secondary-foreground/[.05] transition-colors">
          <BoxIcon className="border border-input p-2 rounded-full w-8 h-8 group-hover:bg-secondary-foreground/[.07] transition-colors" />
          {workspace?.title ?? "No workspace"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch to</DropdownMenuLabel>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.workspace_id}
                onClick={() => {
                  emitter.emit("showPageTransitionLoader");
                  onSwitchWorkspace?.();
                  // Timeout to close sidebar and reset scroll lock styles
                  setTimeout(() => {
                    emitter.emit("showPageTransitionLoader");
                    push(`/${ws.workspace_id}`);
                  }, 200);
                }}
              >
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="text-nowrap text-ellipsis overflow-hidden">
                    {ws.title}
                  </div>
                  {ws.workspace_id === workspace?.workspace_id ? (
                    <CheckIcon className="flex-none" size={16} />
                  ) : (
                    <span className="flex-none w-4 h-4" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <PageTransitionLink
              href="/workspaces"
              className="flex items-center justify-between gap-4 w-full"
            >
              Manage workspaces…
              <LayoutGridIcon size={16} />
            </PageTransitionLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WorkspaceMenu;
