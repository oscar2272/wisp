import { getSharedNote } from "../api";
import type { Route } from "./+types/explore-note-page";
import { TiptapReadOnlyViewer } from "~/features/notes/components/markdown/tiptap-viewer";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { DateTime } from "luxon";
import {
  MessageCircleIcon,
  EyeIcon,
  ChevronUpIcon,
  CalendarIcon,
} from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export async function loader({ request, params }: Route.LoaderArgs) {
  const id = params.id;

  const note = await getSharedNote(id);
  return {
    note,
  };
}

export default function ExploreNotePage({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;

  const getRemainingTime = () => {
    if (!expiresAt) return null;

    const diff = expiresAt
      .diff(now, ["hours", "minutes", "seconds"])
      .toObject();
    const hours = Math.floor(diff.hours || 0);
    const minutes = Math.floor(diff.minutes || 0);
    const seconds = Math.floor(diff.seconds || 0);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 남음`;
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds}초 남음`;
    } else if (seconds > 0) {
      return `${seconds}초 남음`;
    }
    return null;
  };

  const remainingTime = getRemainingTime();
  const formattedDate = DateTime.fromISO(note.updated_at).toFormat(
    "yyyy.MM.dd"
  );

  const isExpired = expiresAt && expiresAt < now;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* 제목 및 날짜 */}
        <div>
          <h1 className="text-3xl font-bold">{note.title || "제목 없음"}</h1>
          <div className="flex flex-row mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {formattedDate}
            </div>

            {expiresAt ? (
              !isExpired ? (
                <Badge
                  variant="outline"
                  className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20"
                >
                  {remainingTime}
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-2">
                  만료됨
                </Badge>
              )
            ) : null}
          </div>
        </div>

        {/* 작성자 정보와 통계를 한 줄에 배치 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Avatar>
              {note.author.avatar ? (
                <AvatarImage
                  src={note.author.avatar}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback>{note.author.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium">{note.author.name}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <Badge variant="outline" asChild>
              <Button variant="ghost" size={null} className="h-6 px-2">
                <ChevronUpIcon className="size-4" />
                <span>{note.likes_count}</span>
              </Button>
            </Badge>
            <Badge
              variant="outline"
              className="h-6 px-2 flex items-center gap-1"
            >
              <MessageCircleIcon className="size-4" />
              <span>{note.comments_count}</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-6 px-2 flex items-center gap-1"
            >
              <EyeIcon className="size-4" />
              <span>{note.seen_count}</span>
            </Badge>
          </div>
        </div>

        <Separator />
      </div>
      {!isExpired ? (
        <div className="prose dark:prose-invert max-w-none">
          <TiptapReadOnlyViewer content={note.content} />
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-center text-xl font-bold my-auto mt-12">
            {note.content}
          </h1>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="mt-12 pt-6 border-t border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              이전 글
            </Button>
            <Button variant="outline" size="sm">
              다음 글
            </Button>
          </div>
          <Button variant="secondary" size="sm">
            목록으로
          </Button>
        </div>
      </div>
    </div>
  );
}
