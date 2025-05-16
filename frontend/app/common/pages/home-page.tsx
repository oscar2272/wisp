import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
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
          {/* 진행 중인 개발 */}
          <div>
            <h3 className="text-lg font-medium mb-3">📆 단기 계획 (~5월 말)</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-2">~ 5월 20일 예정</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>탐색 페이지 검색 및 필터링 기능 추가</li>
                  <li>
                    노트 상세 페이지 UI 개선 (레이아웃 정리, 배지 위치 변경 등)
                  </li>
                  <li>휴지통 기능: 삭제/복원 API 및 프론트 구현</li>
                  <li>/notes 페이지 백엔드 연동 및 리스트 노출</li>
                  <li>링크용 페이지 추가 (노트 상세 페이지로 이동)</li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">~ 5월 25일 예정</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>만료된 노트 처리 방식 결정 및 구현 (백엔드 처리 여부)</li>
                  <li>
                    이미지 업로드: multipart/form-data 처리 및 썸네일 자동 등록
                  </li>
                  <li>서버 인프라 구성 (Nginx ↔ Docker 설정)</li>
                </ul>
              </div>
            </div>
          </div>

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
      <Card className="my-4">
        <CardHeader>
          <CardTitle>최근 작성한 메모</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          아직 작성한 메모가 없습니다.
        </CardContent>
      </Card>

      {/* 안내 영역 */}
      <p className="text-sm text-gray-500 mt-12 text-center">
        📦 모든 메모는 <Link to="/wisp/notes">Note</Link> 에서 확인할 수
        있습니다.
      </p>
    </div>
  );
}
