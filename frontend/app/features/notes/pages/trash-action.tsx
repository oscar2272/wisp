import type { Route } from "./+types/trash-action";
import { restoreTrash } from "../api";
import { makeSSRClient } from "~/supa-client";
export async function action({ request }: Route.ActionArgs) {
  const { client } = makeSSRClient(request);
  const token = await client.auth
    .getSession()
    .then((r) => r.data.session?.access_token);
  if (!token) {
    return { error: "Unauthorized" };
  }
  if (request.method === "PATCH") {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "restore_all") {
      const res = await restoreTrash(token!);
      if (!res.ok) return JSON.stringify({ error: "Restore failed" });

      const newItems = await res.json();
      return new Response(JSON.stringify({ newItems }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
