import { Outlet, redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/auth-layout";
import { getLoggedInUserId } from "~/features/profiles/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const url = new URL(request.url);
  const pathname = url.pathname;
  //로그인한 유저가 /auth/logout 제외한 페이지에 접근하면 메인페이지로 리다이렉트
  if (userId && pathname !== "/auth/logout") {
    return redirect("/wisp");
  }
  return null;
};

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-gradient-to-br from-primary via-black to-primary/50" />
      <Outlet />
    </div>
  );
}
