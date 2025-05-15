export default function ExploreNotePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <img
          src="https://i.pravatar.cc/150?u=user1"
          alt="hyeongyu"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-muted-foreground">hyeongyu</span>
        <span className="text-sm text-muted-foreground ml-auto">
          2025-05-01
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-4">공유된 메모 예시</h1>

      <div className="prose dark:prose-invert mb-8">
        <p>이건 다른 사용자가 공유한 메모의 전체 내용입니다.</p>
      </div>
    </div>
  );
}
