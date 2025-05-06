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
import type { UserProfileWithEmail } from "~/features/profiles/type";
import type { TreeItem } from "../type";
import { OverlayProvider } from "@toss/use-overlay";
export const loader = async ({ request }: Route.LoaderArgs) => {
  const initialItems: TreeItem[] = [
    {
      id: "folder-root",
      parentId: null,
      type: "folder",
      name: "workspace",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "folder-1",
      parentId: "folder-root",
      type: "folder",
      name: "docs",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "note-1",
      parentId: "folder-1",
      type: "note",
      name: "readme.md",
      content: "# README",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
    {
      id: "folder-2",
      parentId: "folder-root",
      type: "folder",
      name: "guide",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "note-2",
      parentId: "folder-2",
      type: "note",
      name: "usage.txt",
      content: "사용법 내용",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
    {
      id: "folder-root-2",
      parentId: null,
      type: "folder",
      name: "workspace2",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "note-2-1",
      parentId: "folder-root-2",
      type: "note",
      name: "readme.md",
      content: "# README",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
  ];

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
      const profile: UserProfileWithEmail = await getUserProfileWithEmail(
        token
      );
      return { userId, profile, initialItems };
    }
  }
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const profile = loaderData?.profile;
  const initialItems = loaderData?.initialItems;
  return (
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
  );
}
