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
import { getUserProfileWithEmail } from "~/features/profiles/api";
import { getToken } from "~/features/profiles/api";
import type { TreeItem } from "../type";
import { getNotesSidebar } from "../api";
import { TokenContext } from "~/context/token-context";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const { client } = makeSSRClient(request);
  //먼저 로그인상태 인지 확인
  const userId = await getLoggedInUserId(client);
  const token = await getToken(request);
  if (!userId) {
    //로그인 하지않은상태에서는 /wisp/notes 로 시작하는페이지에 접근하면 로그인 페이지로 리다이렉트
    if (pathname.startsWith("/wisp/notes")) {
      return redirect("/auth/login");
    }
  } else if (userId) {
    if (!token) {
      return redirect("/auth/login");
    } else {
      const [profile, initialItems] = await Promise.all([
        getUserProfileWithEmail(token),
        getNotesSidebar(token),
      ]);
      return { profile, initialItems, token };
    }
  }
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const profile = loaderData?.profile;
  const initialItems = loaderData?.initialItems;
  const token = loaderData?.token;
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
            <main className="flex-1">
              <Outlet context={{ profile }} />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TokenContext.Provider>
  );
}

export function HydrateFallback() {
  return <p>Loading Game...</p>;
}
