import { getSharedNote } from "../api";
import type { Route } from "./+types/explore-note-page";
import { TiptapReadOnlyViewer } from "~/features/notes/components/markdown/tiptap-viewer";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { DateTime } from "luxon";
import {
  ThumbsUpIcon,
  MessageCircleIcon,
  EyeIcon,
  ClockIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Separator } from "../components/ui/separator";

export async function loader({ request, params }: Route.LoaderArgs) {
  const id = params.id;

  const note = await getSharedNote(id);
  return {
    note,
  };
}

export default function ExploreNotePage({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;
  const avatarUrl = "http://127.0.0.1:8000" + note.author.avatar;
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;
  const remainingDays = expiresAt
    ? Math.floor(expiresAt.diff(now, "days").days)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-6 mb-8">
        {/* 메타 정보 영역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={note.author.name}
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-sm">{note.author.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex gap-1 items-center">
                <ThumbsUpIcon className="size-3" />
                {note.likes_count}
              </Badge>
              <Badge variant="outline" className="flex gap-1 items-center">
                <MessageCircleIcon className="size-3" />
                {note.comments_count}
              </Badge>
              <Badge variant="outline" className="flex gap-1 items-center">
                <EyeIcon className="size-3" />
                {note.seen_count}
              </Badge>
              {remainingDays !== null && (
                <Badge variant="secondary" className="flex gap-1 items-center">
                  <ClockIcon className="size-3" />
                  {remainingDays}일 남음
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => {
                // TODO: 좋아요 기능 구현
              }}
            >
              <ChevronUpIcon className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{note.title || "제목 없음"}</h1>
          <span className="text-sm text-muted-foreground">
            최신: {DateTime.fromISO(note.updated_at).toFormat("yyyy.MM.dd")}
          </span>
        </div>

        <Separator className="my-2" />
      </div>

      <div className="prose dark:prose-invert">
        <TiptapReadOnlyViewer content={note.content} />
      </div>
    </div>
  );
}
