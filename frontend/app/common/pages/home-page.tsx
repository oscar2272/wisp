import { Link } from "react-router";
export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* 헤더 */}

      <h1 className="text-3xl font-bold mb-2">Welcome to Wisp</h1>
      <p className="text-muted-foreground mb-8">
        Drop secret notes. Share securely. Vanish when viewed.
      </p>

      {/* 개발 로드맵 */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">🚀 개발 로드맵</h2>

        <div className="space-y-8">
          {/* 예정된 기능 */}
          <div>
            <h3 className="text-lg font-medium mb-3">📌 예정된 기능</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>댓글 시스템 (대댓글 포함, Mentions 기능 고려)</li>
              <li>마크다운을 PDF로 저장하는 기능</li>
              <li>드래그 앤 드롭으로 파일 및 폴더 이동</li>
              <li>AI 기반 요약 기능 (JSON → 텍스트 변환 or LLM summarizer)</li>
              <li>Skeleton UI 및 Suspense를 활용한 로딩 최적화</li>
              <li>
                정밀한 노트 만료 처리 (🕒 Celery 예약(eta) Task 기반)
                <span className="text-muted-foreground text-xs block ml-4">
                  노트 저장 시 <code>expires_at</code> 시간에 맞춰 비동기 만료
                  작업 예약
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          * 개발 일정 및 우선순위는 변경될 수 있습니다.
        </p>
      </div>

      {/* 최근 메모 카드 (더미) */}
      {/* <Card className="my-4">
        <CardHeader>
          <CardTitle>최근 작성한 메모</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          아직 작성한 메모가 없습니다.
        </CardContent>
      </Card> */}

      {/* 안내 영역 */}
      <p className="text-sm text-gray-500 mt-12 text-center">
        📦 모든 메모는 <Link to="/wisp/notes">Note</Link> 에서 확인할 수
        있습니다.
      </p>
    </div>
  );
}
