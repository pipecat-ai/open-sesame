"use client";

import UserMenu from "@/app/(authenticated)/[workspaceId]/UserMenu";
import PageTransitionLink from "@/components/PageTransitionLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import emitter from "@/lib/eventEmitter";
import { WorkspaceModel } from "@/lib/sesameApi";
import { cn } from "@/lib/utils";
import { getWorkspaceStructuredData } from "@/lib/workspaces";
import { CloudIcon, EllipsisIcon, SquarePlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  email?: string;
  signOut?: boolean;
  workspaces: WorkspaceModel[];
}

export default function Sidebar({
  email,
  signOut = false,
  workspaces,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const toggleSidebar = () => setIsOpen((prev) => !prev);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    emitter.on("toggleSidebar", toggleSidebar);
    window.addEventListener("resize", handleResize);
    return () => {
      emitter.off("toggleSidebar", toggleSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const hasWorkspaces = workspaces.length > 0;

  const getContent = () => (
    <div className="bg-inherit flex flex-col gap-6 p-4 sticky top-0 overflow-y-auto h-full">
      <div className="flex flex-col gap-1">
        <PageTransitionLink
          href="/workspaces/new"
          className={cn(
            "flex gap-2 items-center px-3 py-2 rounded-full border border-input transition-colors hover:bg-input",
            {
              "bg-input": pathname === `/workspaces/new`,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          <SquarePlusIcon size={16} />
          Create new workspace
        </PageTransitionLink>

        <PageTransitionLink
          href="/workspaces/services"
          className={cn(
            "flex gap-2 items-center px-3 py-2 rounded-lg transition-colors hover:bg-input",
            {
              "bg-input": pathname === `/workspaces/services`,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          <CloudIcon size={16} />
          Services
        </PageTransitionLink>
      </div>

      <Separator />

      <span className="text-xl font-semibold">Your Workspaces</span>

      <ul className="flex-grow flex flex-col">
        {hasWorkspaces ? (
          workspaces.map((workspace) => {
            const isActive = pathname.includes(workspace.workspace_id);
            const structuredData = getWorkspaceStructuredData(workspace.config);
            return (
              <li
                key={workspace.workspace_id}
                className={cn(
                  "grid grid-cols-[calc(100%-36px)_32px] gap-1 items-center p-2 overflow-hidden group",
                  {
                    "bg-input rounded-lg": isActive,
                  }
                )}
              >
                <PageTransitionLink
                  href={`/workspaces/${workspace.workspace_id}`}
                >
                  <div className="text-nowrap text-ellipsis overflow-hidden">
                    {workspace.title}
                  </div>
                  <span className="capitalize text-xs font-mono">
                    {structuredData.llm.service} (
                    {structuredData.llm.model.label})
                  </span>
                </PageTransitionLink>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex-none group-hover:visible group-focus-within:visible aria-expanded:visible p-2",
                      {
                        invisible: !isActive,
                      }
                    )}
                  >
                    <EllipsisIcon size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <PageTransitionLink href={`/${workspace.workspace_id}`}>
                        Go to Workspace
                      </PageTransitionLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        emitter.emit("deleteWorkspace", workspace);
                      }}
                    >
                      Delete…
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          })
        ) : (
          <li className="text-md font-bold mb-2 text-secondary-foreground">
            No workspaces
          </li>
        )}
      </ul>

      <div className="mt-auto sticky bottom-0 bg-inherit">
        <div className="bg-inherit -m-4 p-4">
          {signOut && <UserMenu email={email} />}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar using Sheet component */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="bg-secondary pt-16" side="left">
            <SheetTitle className="sr-only">Workspaces</SheetTitle>
            <SheetDescription></SheetDescription>
            {getContent()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-[var(--sidebar-width)] bg-secondary h-dvh">
        {getContent()}
      </div>
    </>
  );
}
