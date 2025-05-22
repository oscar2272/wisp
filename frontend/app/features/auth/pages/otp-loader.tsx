import { makeSSRClient } from "~/supa-client";
import { redirect } from "react-router";
import { SignInOrSignUp } from "~/features/profiles/api";
import type { Route } from "./+types/otp-loader";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const { data: sessionData, error } = await client.auth.getSession();
  if (error || !sessionData.session?.access_token) {
    console.error(error);
    return redirect("/auth/login");
  }

  const token = sessionData.session.access_token;
  await SignInOrSignUp(token);
  return redirect("/", { headers });
};

export default function OtpActionPage() {
  return <p>Signing in...</p>; // 짧은 로딩 메시지 (원하면 skeleton 등으로 대체)
}
