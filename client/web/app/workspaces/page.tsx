import ErrorPage from "@/components/ErrorPage";
import { DEMO_COOKIE_KEY } from "@/lib/authHeaders";
import { WorkspaceWithConversations } from "@/lib/sesameApi";
import { getWorkspaces } from "@/lib/workspaces";
import { cookies } from "next/headers";
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

  const demoToken = cookies().get(DEMO_COOKIE_KEY);

  if (!workspaces.length) {
    if (!demoToken && !process.env.SESAME_USER_TOKEN) {
      redirect("/welcome");
    } else {
      redirect("/workspaces/new");
    }
  }

  redirect(`/workspaces/${workspaces[0].workspace_id}`);
}
