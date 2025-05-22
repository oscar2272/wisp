import { AlertCircleIcon } from "lucide-react";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 헤더 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircleIcon className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">
                노트를 볼 수 없습니다
              </h1>
            </div>
          </div>

          {/* 컨텐츠 섹션 */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                이 노트는 더 이상 접근할 수 없습니다
              </h2>
              <p className="text-muted-foreground">
                노트가 만료되었거나 삭제되었을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
