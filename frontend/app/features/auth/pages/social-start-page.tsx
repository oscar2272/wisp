import { redirect } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/social-start-page";
import { makeSSRClient } from "~/supa-client";

const paramsSchema = z.object({
  provider: z.enum(["github", "kakao"]),
});
export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/auth/login");
  }
  const { provider } = data;
  const redirectTo = `https://wisp-three.vercel.app/auth/social/${provider}/complete`;
  const { client, headers } = makeSSRClient(request);
  const {
    data: { url },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
  if (url) {
    return redirect(url, { headers });
  }
  if (error) {
    throw error;
  }
};
