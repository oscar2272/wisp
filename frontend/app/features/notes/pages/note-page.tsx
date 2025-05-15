import { Button } from "~/common/components/ui/button";
import {
  CalendarIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  ClockIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  Link2,
  LinkIcon,
} from "lucide-react";
import { Badge } from "~/common/components/ui/badge";
import { ShareDialog } from "../components/share-dialog";
import type { Route } from "./+types/note-page";
import { DateTime } from "luxon";
import { Link, redirect, useFetcher, useParams } from "react-router";
import { getToken } from "~/features/profiles/api";
import { createUrl, deleteNote, getNote, getUrl, patchShare } from "../api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";

import { toast } from "sonner";
import { TiptapReadOnlyViewer } from "../components/markdown/tiptap-viewer";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const shareType = formData.get("shareType");
  const expiryDate = formData.get("expiryDate");
  const token = await getToken(request);
  if (!token) {
    return { error: "Unauthorized" };
  }

  if (request.method === "DELETE") {
    console.log("삭제 실행");
    try {
      const id = params.id;
      const rawId = id!.toString().replace("note-", "");
      await deleteNote(Number(rawId), token);

      return redirect("/wisp/profile");
    } catch (err) {
      console.error("삭제 실패", err);
      return new Response(
        JSON.stringify({ success: false, message: "삭제 실패" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
  if (request.method === "PATCH") {
    try {
      const id = params.id;
      const rawId = id!.toString().replace("note-", "");
      await patchShare(
        rawId,
        token,
        shareType!.toString(),
        expiryDate?.toString()
      );
    } catch (err) {
      console.error("공유 설정 실패", err);
      return new Response(
        JSON.stringify({ success: false, message: "공유 설정 실패" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  if (request.method === "POST") {
    console.log("개인 링크 생성 실행");
    try {
      const id = params.id;
      const rawId = id!.toString().replace("note-", "");
      const res = await createUrl(rawId, token);
      console.log(res);
      return { url: res.url };
    } catch (err) {
      console.error("개인 링크 생성 실패", err);
      return new Response(
        JSON.stringify({ success: false, message: "개인 링크 생성 실패" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
export async function loader({ request, params }: Route.LoaderArgs) {
  const token = await getToken(request);
  if (!token) {
    return { error: "Unauthorized" };
  }
  const id = params.id;
  const rawId = id.replace("note-", "");
  const { note } = await getNote(rawId, token);
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;
  const isExpired = expiresAt ? expiresAt < now : false;
  const remainingDays = expiresAt
    ? Math.floor(expiresAt.diff(now, "days").days)
    : null;

  let expiryBadge: {
    label: string;
    variant: "secondary" | "destructive" | "default";
  } | null = null;
  let statusBadge: {
    label: string;
    variant: "outline" | "secondary" | "destructive" | "default";
  } = {
    label: "",
    variant: "outline",
  };

  if (!note.is_shared) {
    statusBadge = { label: "비공개", variant: "outline" };
    expiryBadge = null; // 비공개는 만료 의미 없음
  } else if (note.is_public) {
    statusBadge = { label: "공개중", variant: "secondary" };
    expiryBadge = isExpired
      ? { label: "만료됨", variant: "destructive" }
      : { label: `${remainingDays}일 남음`, variant: "secondary" };
  } else {
    statusBadge = { label: "공유중", variant: "secondary" };
    expiryBadge = isExpired
      ? { label: "만료됨", variant: "destructive" }
      : { label: `${remainingDays}일 남음`, variant: "secondary" };
  }
  let url = null;
  if (note.slug !== null) {
    const res = await getUrl(rawId, token);
    url = res.url;
  }
  // function extractTypes(node: any, types = new Set()) {
  //   if (typeof node !== "object" || node === null) return types;
  //   if (node.type) types.add(node.type);
  //   if (node.content)
  //     node.content.forEach((child: any) => extractTypes(child, types));
  //   return types;
  // }
  return {
    note,
    statusBadge,
    expiryBadge,
    isExpired,
    url,
  };
}

export default function NotePage({ loaderData }: Route.ComponentProps) {
  const params = useParams();
  const fetcher = useFetcher();
  const url = loaderData!.url;
  const note = loaderData!.note;
  const isExpired = loaderData!.isExpired;
  const statusBadge = loaderData!.statusBadge;
  const expiryBadge = loaderData!.expiryBadge;

  return (
    <div className="flex flex-col w-full items-center max-w-7xl py-8 space-y-8">
      <div className="flex flex-col items-start w-full space-y-6 py-1 px-2">
        {/* 헤더 영역: 제목 및 메타데이터 */}
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">
                {note!.title || "제목 없음"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {DateTime.fromISO(note!.created_at).toFormat("yyyy.MM.dd")}
                </div>
                {note!.is_shared && !isExpired && note!.expires_at && (
                  <>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      만료:{" "}
                      {DateTime.fromISO(note!.expires_at).toFormat(
                        "yyyy.MM.dd"
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 주요 액션 버튼 그룹 */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {note!.slug && (
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="flex flex-row justify-start w-full items-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${url}`);
                          toast.success("개인 링크가 복사되었습니다.");
                        }}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        링크 복사
                      </Button>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="flex flex-row justify-start w-full items-center gap-2"
                      onClick={() => {
                        fetcher.submit(null, { method: "POST" });
                        toast.success("개인 링크가 생성되었습니다.");
                      }}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      링크 생성
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <ShareDialog />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Button
                      asChild
                      variant="ghost"
                      className="flex flex-row justify-start w-full items-center gap-2"
                    >
                      <Link
                        to={`/wisp/notes/${params.id}/edit`}
                        className="flex items-center gap-2 pl-3"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        수정
                      </Link>
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="flex flex-row justify-start w-full items-center gap-2"
                      onClick={() => {
                        fetcher.submit(
                          { id: params!.id! },
                          { method: "delete" }
                        );
                      }}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* 상태 뱃지 및 통계 */}
          <div className="flex items-center gap-3">
            <Badge variant={statusBadge!.variant}>{statusBadge!.label}</Badge>
            {expiryBadge && (
              <Badge variant={expiryBadge.variant}>{expiryBadge.label}</Badge>
            )}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex gap-1 items-center">
                <ThumbsUpIcon className="size-3" />
                {note!.likes_count}
              </Badge>
              <Badge variant="secondary" className="flex gap-1 items-center">
                <MessageCircleIcon className="size-3" />
                {note!.comments_count}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 노트 콘텐츠 영역 */}
      <div className="min-h-[200px] w-full rounded-lg">
        <TiptapReadOnlyViewer key={note!.id} content={note!.content} />
      </div>
    </div>
  );
}
