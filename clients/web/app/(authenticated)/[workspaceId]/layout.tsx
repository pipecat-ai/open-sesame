"use server";

import ErrorPage from "@/components/ErrorPage";
import QueryClientProvider from "@/components/QueryClientProvider";
import { getEmail } from "@/lib/auth";
import { getLLMModelsByService } from "@/lib/llm";
import { WorkspaceWithConversations } from "@/lib/sesameApi";
import { getWorkspaces, getWorkspaceStructuredData } from "@/lib/workspaces";
import { redirect } from "next/navigation";
import React from "react";
import DeleteConversationModal from "./DeleteConversationModal";
import DisabledInSandboxModeModal from "./DisabledInSandboxModeModal";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Define the layout for the workspace
interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

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
  const workspace =
    workspaces.find((w) => w.workspace_id === workspaceId) ?? workspaces[0];

  if (!workspace) redirect("/");

  const structuredWorkspaceData = getWorkspaceStructuredData(workspace.config);
  const models = getLLMModelsByService(structuredWorkspaceData.llm.service);

  const email = await getEmail();

  return (
    <div className="lg:grid lg:grid-cols-[var(--sidebar-width)_1fr] min-h-dvh">
      {/* Sidebar */}
      <Sidebar
        conversations={workspace.conversations}
        email={email}
        signOut={!process.env.SESAME_USER_TOKEN}
        workspace={workspace}
        workspaces={workspaces}
      />

      {/* Main content area */}
      <div className="flex flex-col min-h-dvh w-full bg-background">
        {/* Navbar */}
        <Navbar
          currentModelValue={structuredWorkspaceData.llm.model.value}
          models={models}
        />

        {/* Page content */}
        <main className="relative flex-grow mx-auto max-w-3xl w-full flex flex-col">
          {children}
        </main>
      </div>

      <QueryClientProvider>
        <DeleteConversationModal
          conversations={workspace.conversations}
          workspaceId={workspaceId}
        />
      </QueryClientProvider>
      <DisabledInSandboxModeModal />
    </div>
  );
}
