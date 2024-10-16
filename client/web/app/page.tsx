import ErrorPage from "@/components/ErrorPage";
import { DEMO_COOKIE_KEY } from "@/lib/authHeaders";
import { WorkspaceWithConversations } from "@/lib/sesameApi";
import { getWorkspaces } from "@/lib/workspaces";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WorkspaceConversationPage() {
  let workspaces: WorkspaceWithConversations[];

  const demoToken = cookies().get(DEMO_COOKIE_KEY);

  if (!demoToken) {
    redirect("/welcome");
  }

  try {
    workspaces = await getWorkspaces();
  } catch (e) {
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
  redirect(`/${workspaces[0].workspace_id}`);
}
