import { makeSSRClient } from "~/supa-client";
import { redirect } from "react-router";
import type { Route } from "./+types/logout-page";
import { clearSessionCache } from "~/features/profiles/api";
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  await client.auth.signOut();
  clearSessionCache();
  return redirect("/auth/login", { headers });
};
