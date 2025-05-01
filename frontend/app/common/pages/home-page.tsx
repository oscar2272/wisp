import { Button } from "~/common/components/ui/button";
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

      {/* CTA */}
      <div className="mb-12">
        <Button size="lg" asChild>
          <Link to="/wisp/notes/new">✍️ 새 메모 작성하기</Link>
        </Button>
      </div>

      {/* 최근 메모 카드 (더미) */}
      <Card className="mb-4">
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
