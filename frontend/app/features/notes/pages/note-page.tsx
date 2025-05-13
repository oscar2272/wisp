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
import { Link, useParams } from "react-router";
import TiptapReadOnlyViewer from "../components/tiptap-viewer";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const shareType = formData.get("shareType");
  const expiryDate = formData.get("expiryDate");
  // API 호출 또는 상태 업데이트 등 필요한 작업 수행
}
export async function loader({ request }: Route.LoaderArgs) {
  const note = {
    file_name: "테스트 메모",
    created_at: "2025-04-01T16:58:06.193+09:00",
    expires_at: "2025-05-16T16:58:06.193+09:00",
    is_shared: true,
    is_public: true,
    content:
      "# 제목\n\n**내용**\n\n[링크](https://www.google.com) \n```js\nconsole.log('Hello, world!');\n```\n\n- [ ] 할일1\n- [ ] 할일2\n- [ ] 할일3",
    likes_count: 10,
    comments_count: 10,
  };
  const now = DateTime.now();
  const expiresAt = DateTime.fromISO(note.expires_at);
  const isExpired = expiresAt < now;
  const remainingDays = Math.floor(expiresAt.diff(now, "days").days);

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
    <div className="mx-auto max-w-5xl py-8 px-4 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col justify-between space-y-10">
          <h1 className="text-3xl font-bold">
            {note.file_name || "제목 없음"}
          </h1>
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex gap-2 items-center">
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              {expiryBadge && (
                <Badge variant={expiryBadge.variant}>{expiryBadge.label}</Badge>
              )}
              <div className="w-px h-4 bg-border mx-2" />
              <Badge variant="secondary" className="flex gap-1 items-center">
                <ThumbsUpIcon className="size-3" />
                {note.likes_count}
              </Badge>
              <Badge variant="secondary" className="flex gap-1 items-center">
                <MessageCircleIcon className="size-3" />
                {note.comments_count}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                최신: {DateTime.fromISO(note.created_at).toFormat("yyyy.MM.dd")}
              </div>
              {note.is_shared && !isExpired && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  만료:{" "}
                  {DateTime.fromISO(note.expires_at).toFormat("yyyy.MM.dd")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[200px] rounded-lg">
        <TiptapReadOnlyViewer content={note.content} />
      </div>

      <div className="flex justify-between border-t pt-6">
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
          {!note.is_shared ? (
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
