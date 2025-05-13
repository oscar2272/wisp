import { Button } from "~/common/components/ui/button";
import {
  CalendarIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  ClockIcon,
  LockIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Badge } from "~/common/components/ui/badge";
import { ShareDialog } from "../components/share-dialog";
import type { Route } from "./+types/note-page";
import { DateTime } from "luxon";
import { Link, useLoaderData, useNavigate, useParams } from "react-router";
import TiptapReadOnlyViewer from "../components/tiptap-viewer";
import { getToken } from "~/features/profiles/api";
import { getNote } from "../api";
import type { Note } from "../type";
import { ClientOnly } from "remix-utils/client-only";
import { Separator } from "~/common/components/ui/separator";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const shareType = formData.get("shareType");
  const expiryDate = formData.get("expiryDate");
  // API 호출 또는 상태 업데이트 등 필요한 작업 수행
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

  return { note, statusBadge, expiryBadge, isExpired };
}

export default function NotePage({ loaderData }: Route.ComponentProps) {
  const params = useParams(); // 추후에 id로 직접받아올것
  const note = loaderData!.note;
  const isExpired = loaderData!.isExpired;
  const statusBadge = loaderData!.statusBadge;
  const expiryBadge = loaderData!.expiryBadge;
  return (
    <div className="flex flex-col w-full items-center max-w-7xl py-8 space-y-8">
      <div className="flex flex-col items-start w-full  space-y-10 py-1 px-4">
        <h1 className="text-3xl font-bold">{note!.title || "제목 없음"}</h1>
        <div className="flex flex-row justify-between items-center gap-4 w-full">
          <div className="flex gap-2 items-center">
            <Badge variant={statusBadge!.variant}>{statusBadge!.label}</Badge>
            {expiryBadge && (
              <Badge variant={expiryBadge.variant}>{expiryBadge.label}</Badge>
            )}
            <div className="w-px h-4 bg-border mx-2" />
            <Badge variant="secondary" className="flex gap-1 items-center">
              <ThumbsUpIcon className="size-3" />
              {note!.likes_count}
            </Badge>
            <Badge variant="secondary" className="flex gap-1 items-center">
              <MessageCircleIcon className="size-3" />
              {note!.comments_count}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              최신: {DateTime.fromISO(note!.created_at).toFormat("yyyy.MM.dd")}
            </div>
            {note!.is_shared && !isExpired && (
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                만료:{" "}
                {note!.expires_at
                  ? DateTime.fromISO(note!.expires_at).toFormat("yyyy.MM.dd")
                  : null}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[200px] w-full rounded-lg">
        <ClientOnly fallback={<p>로딩 중...</p>}>
          {() => (
            <TiptapReadOnlyViewer key={note!.id} content={note!.content} />
          )}
        </ClientOnly>
      </div>
      <div className="flex justify-between  pt-6 w-full">
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/wisp/notes/${params.id}/edit`}>
              <PencilIcon className="mr-2 h-4 w-4" />
              수정
            </Link>
          </Button>
          <Button variant="destructive">
            <TrashIcon className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
        <div className="flex gap-2">
          <ShareDialog />
          {!note!.is_shared ? (
            <Button variant="secondary" disabled={isExpired}>
              <ShareIcon className="mr-2 h-4 w-4" />
              링크 복사
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
