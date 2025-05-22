import { Outlet, redirect, useSearchParams } from "react-router";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/auth-layout";
import { getLoggedInUserId } from "~/features/profiles/queries";
import { useEffect } from "react";
import { toast } from "sonner";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const url = new URL(request.url);
  const pathname = url.pathname;
  //로그인한 유저가 /auth/logout 제외한 페이지에 접근하면 메인페이지로 리다이렉트
  if (userId && pathname !== "/auth/logout") {
    return redirect("/");
  }
  return null;
};

export default function AuthLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");
  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { id: "auth-message" });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("message");
      setSearchParams(newParams, { replace: true });
    }
  }, [message, searchParams, setSearchParams]);

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-gray-900 flex items-center justify-center text-white px-8">
        <div className="max-w-xs">
          <h1 className="text-2xl font-semibold mb-2">Wisp</h1>
          <p className="text-sm text-gray-300">
            비밀 링크를 생성해
            <br />
            안전하게 메모를 공유하세요.
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
