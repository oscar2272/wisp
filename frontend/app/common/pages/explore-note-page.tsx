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
  // const avatarUrl = "http://127.0.0.1:8000" + note.author.avatar; //dev
  const avatarUrl = note.author.avatar; //prod
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;
  const remainingDays = expiresAt
    ? Math.floor(expiresAt.diff(now, "days").days)
    : null;
  const formattedDate = DateTime.fromISO(note.updated_at).toFormat(
    "yyyy.MM.dd"
  );

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

            {remainingDays !== null && (
              <Badge
                variant="outline"
                className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20"
              >
                {remainingDays}일 남음
              </Badge>
            )}
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

      <div className="prose dark:prose-invert max-w-none">
        <TiptapReadOnlyViewer content={note.content} />
      </div>

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
