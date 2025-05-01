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

      <div className="flex gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="11" x2="23" y2="11" />
            <line x1="20" y1="8" x2="20" y2="14" />
          </svg>
          <span>128</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
          <span>3</span>
        </div>
      </div>
    </div>
  );
}
