import { Outlet, redirect } from "react-router";
import { SidebarProvider, SidebarInset } from "~/common/components/ui/sidebar";
import NoteSidebar from "../components/sidebar/note-sidebar";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/profiles/queries";
import type { Route } from "./+types/sidebar-layout";
import { getUserProfileWithEmail } from "~/features/profiles/api";
import { getToken } from "~/features/profiles/api";
import type { TreeItem } from "../type";
import { getNotesSidebar, getTrash } from "../api";
import { TokenContext } from "~/context/token-context";
export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const { client } = makeSSRClient(request);
  //먼저 로그인상태 인지 확인
  const userId = await getLoggedInUserId(client);
  const token = await getToken(request);
  if (!userId) {
    //로그인 하지않은상태에서는 /wisp/notes 로 시작하는페이지에 접근하면 로그인
    const message = encodeURIComponent("로그인이 필요합니다.");
    if (pathname.startsWith("/wisp/notes")) {
      return redirect(`/auth/login?message=${message}`);
    }
  } else if (userId) {
    if (!token) {
      const message = encodeURIComponent("토큰이 필요합니다.");
      return redirect(`/auth/login?message=${message}`);
    } else {
      const [profile, initialItems, trash] = await Promise.all([
        getUserProfileWithEmail(token),
        getNotesSidebar(token),
        getTrash(token),
      ]);
      return { profile, initialItems, token, trash };
    }
  }
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const profile = loaderData?.profile;
  const initialItems = loaderData?.initialItems;
  const token = loaderData?.token;
  const trash = loaderData?.trash;
  return (
    <TokenContext.Provider value={token!}>
      <SidebarProvider>
        <NoteSidebar
          email={profile!.email}
          username={profile!.name}
          avatar={profile!.avatar}
          initialItems={initialItems as TreeItem[]}
        />
        <SidebarInset>
          <div className="flex min-h-screen w-full">
            <main className="w-full">
              <Outlet context={{ profile, trash }} />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TokenContext.Provider>
  );
}
