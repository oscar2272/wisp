import { Button } from "~/common/components/ui/button";
import {
  CalendarIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  ClockIcon,
  LockIcon,
} from "lucide-react";
import { Badge } from "~/common/components/ui/badge";

export default function NotePage() {
  const note = {
    file_name: "테스트 메모",
    created_at: "2024-01-01",
    expires_at: "2025-05-01",
    is_shared: true,
    content: "내용 없음",
  };
  const expired = new Date(note.expires_at) < new Date();

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col justify-between space-y-10">
          <h1 className="text-3xl font-bold">
            {note.file_name || "제목 없음"}
          </h1>
          <div className="flex flex-row justify-between items-center gap-4">
            {note.is_shared ? (
              expired ? (
                <Badge variant="destructive">만료됨</Badge>
              ) : (
                <Badge variant="secondary">
                  공유됨 (
                  {Math.floor(
                    (new Date(note.expires_at).getTime() - Date.now()) /
                      86400000
                  )}
                  일 남음)
                </Badge>
              )
            ) : (
              <Badge variant="outline">
                <LockIcon className="h-4 w-4" />
                비공개
              </Badge>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                최신: {new Date(note.created_at).toLocaleDateString()}
              </div>
              {note.is_shared && !expired && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  만료: {new Date(note.expires_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[200px] rounded-lg border bg-muted/40 p-6">
        <p className="whitespace-pre-wrap text-lg">{note.content}</p>
      </div>

      <div className="flex justify-between border-t pt-6">
        <div className="flex gap-2">
          <Button variant="outline">
            <PencilIcon className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button variant="destructive">
            <TrashIcon className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
        {!note.is_shared ? (
          <Button>
            <ShareIcon className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        ) : (
          <Button variant="secondary" disabled={expired}>
            <ShareIcon className="mr-2 h-4 w-4" />
            링크 복사
          </Button>
        )}
      </div>
    </div>
  );
}
