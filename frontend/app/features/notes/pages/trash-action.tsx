import { getToken } from "~/features/profiles/api";
import type { Route } from "./+types/trash-action";
import { restoreTrash } from "../api";

export async function action({ request }: Route.ActionArgs) {
  const token = await getToken(request);
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
