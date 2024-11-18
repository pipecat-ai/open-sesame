"use client";

import PageTransitionLink from "@/components/PageTransitionLink";
import SignOutButton from "@/components/SignOutButton";
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
import { EllipsisIcon, SquarePlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  signOut?: boolean;
  workspaces: WorkspaceModel[];
}

export default function Sidebar({ signOut = false, workspaces }: SidebarProps) {
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

  const getContent = (hasTitle: boolean) => (
    <div className="flex flex-col gap-6 p-4 sticky top-0 overflow-y-auto h-dvh">
      {hasTitle && (
        <h2 className="text-xl font-semibold -m-4 mb-0 p-4 sticky -top-4 bg-secondary shadow-md z-10">
          Workspaces
        </h2>
      )}

      <div>
        <PageTransitionLink
          href="/workspaces/new"
          className={cn(
            "flex gap-2 items-center px-3 py-2 rounded-lg transition-colors hover:bg-input",
            {
              "bg-input": pathname === `/workspaces/new`,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          <SquarePlusIcon size={16} />
          Create new workspaces
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
        {signOut && (
          <SignOutButton className="sticky bottom-0 z-10 mt-auto">
            Sign out
          </SignOutButton>
        )}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar using Sheet component */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="bg-secondary" side="left">
            <SheetTitle className="-m-4 mb-0 p-4 sticky top-0 bg-background z-10 shadow-md">
              Workspaces
            </SheetTitle>
            <SheetDescription></SheetDescription>
            {getContent(false)}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-[var(--sidebar-width)] bg-secondary">
        {getContent(true)}
      </div>
    </>
  );
}
