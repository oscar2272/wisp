import { getLinkNote } from "../api";
import type { Route } from "./+types/link-page";
import { TiptapReadOnlyViewer } from "~/features/notes/components/markdown/tiptap-viewer";
import { DateTime } from "luxon";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { redirect } from "react-router";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const note = await getLinkNote(params.id);

  // 노트가 삭제되었거나 만료된 경우 expired-page로 리다이렉트
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;
  const isExpired = expiresAt && expiresAt < now;

  if (note.is_deleted || isExpired) {
    return redirect("/expired");
  }

  return { note };
};

export default function LinkPage({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;
  const now = DateTime.now();
  const expiresAt = note.expires_at ? DateTime.fromISO(note.expires_at) : null;
  const formattedDate = DateTime.fromISO(note.updated_at).toFormat(
    "yyyy.MM.dd"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 헤더 섹션 */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {note.title || "제목 없음"}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {note.author.avatar ? (
                    <AvatarImage
                      src={note.author.avatar}
                      alt={note.author.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>{note.author.name?.[0]}</AvatarFallback>
                  )}
                </Avatar>
                <span className="font-medium">{note.author.name}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {formattedDate}
                </div>
                {expiresAt ? (
                  <div className="flex flex-row items-center gap-1 text-muted-foreground">
                    <ClockIcon className="h-4 w-4" />
                    만료: {expiresAt.toFormat("yyyy.MM.dd HH:mm")}
                  </div>
                ) : (
                  <div className="text-muted-foreground">무기한</div>
                )}
              </div>
            </div>
          </div>

          {/* 컨텐츠 섹션 */}
          <div className="prose dark:prose-invert max-w-none">
            <TiptapReadOnlyViewer content={note.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
