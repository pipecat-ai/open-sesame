import ClientPage from "@/components/ClientPage";
import { getWorkspace, getWorkspaceStructuredData } from "@/lib/workspaces";
import { redirect } from "next/navigation";

interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = await params;
  const workspace = await getWorkspace(workspaceId);

  if (!workspace) redirect("/");

  return (
    <ClientPage
      conversationId="new"
      messages={[]}
      structuredWorkspace={getWorkspaceStructuredData(workspace.config)}
      workspaceId={workspaceId}
    />
  );
}
