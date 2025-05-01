import { Outlet, redirect } from "react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";
import NoteSidebar from "../components/note-sidebar";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/profiles/queries";
import type { Route } from "./+types/sidebar-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const { client } = makeSSRClient(request);

  //먼저 로그인상태 인지 확인
  const userId = await getLoggedInUserId(client);
  if (!userId) {
    //로그인 하지않은상태에서는 /wisp/notes 로 시작하는페이지에 접근하면 로그인 페이지로 리다이렉트
    if (pathname.startsWith("/wisp/notes")) {
      return redirect("/auth/login");
    }
  } else if (userId) {
    return null;
  }
};

export default function SidebarLayout() {
  return (
    <SidebarProvider>
      <NoteSidebar />
      <SidebarInset>
        <div className="flex min-h-screen w-full">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
