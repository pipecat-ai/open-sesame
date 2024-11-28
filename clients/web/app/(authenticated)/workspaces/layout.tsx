"use server";

import DeleteWorkspaceModal from "@/app/(authenticated)/workspaces/DeleteWorkspaceModal";
import ErrorPage from "@/components/ErrorPage";
import { getEmail } from "@/lib/auth";
import { WorkspaceWithConversations } from "@/lib/sesameApi";
import { getWorkspaces } from "@/lib/workspaces";
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Define the layout for the workspace
interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export default async function WorkspacesLayout({
  children,
}: WorkspaceLayoutProps) {
  let workspaces: WorkspaceWithConversations[];
  try {
    workspaces = await getWorkspaces();
  } catch {
    return (
      <ErrorPage
        title="Unable to fetch from server"
        description={`Unable to retrieve workspaces from ${process.env.SESAME_BASE_URL}. Please check your client .env file.`}
      />
    );
  }

  const email = await getEmail();

  return (
    <div className="bg-secondary lg:grid lg:grid-cols-[var(--sidebar-width)_1fr] min-h-dvh">
      {/* Sidebar */}
      <Sidebar
        email={email}
        signOut={!process.env.SESAME_USER_TOKEN}
        workspaces={workspaces}
      />

      {/* Main content area */}
      <div className="flex flex-col h-dvh lg:h-[calc(100dvh-16px)] w-full bg-background lg:my-2 overflow-auto lg:rounded-l-3xl">
        <Navbar />

        {/* Page content */}
        <main className="relative flex-grow mx-auto max-w-3xl w-full flex flex-col">
          {children}
        </main>
      </div>

      <DeleteWorkspaceModal />
    </div>
  );
}
