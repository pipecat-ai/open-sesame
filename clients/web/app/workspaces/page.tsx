import ErrorPage from "@/components/ErrorPage";
import { WorkspaceWithConversations } from "@/lib/sesameApi";
import { getWorkspaces } from "@/lib/workspaces";
import { redirect } from "next/navigation";

export default async function WorkspacesPage() {
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

  if (!workspaces.length) {
    redirect("/workspaces/new");
  }

  redirect(`/workspaces/${workspaces[0].workspace_id}`);
}