import { z } from "zod";
import type { Route } from "./+types/social-start-page";
import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { SignInOrSignUp } from "~/features/profiles/api";

const paramsSchema = z.object({
  provider: z.enum(["github"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/auth/login");
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/auth/login");
  }
  const { client, headers } = makeSSRClient(request);
  const { data: sessionData, error } = await client.auth.exchangeCodeForSession(
    code
  );
  if (error || !sessionData.session?.access_token) {
    console.error(error);
    return redirect("/auth/login");
  }

  const token = sessionData.session.access_token;
  await SignInOrSignUp(token);

  return redirect("/", { headers });
};
