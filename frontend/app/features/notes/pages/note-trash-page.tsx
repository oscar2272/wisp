import { Link, useOutletContext } from "react-router";
import type { TreeItem } from "../type";
import { TrashTreeMenu } from "../components/trash/trash-tree-menu";
import { Button } from "~/common/components/ui/button";
import { ArchiveRestore, Trash2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export default function NoteTrashPage() {
  const { trash } = useOutletContext() as {
    trash: TreeItem[];
  };
  const handleDelete = (trash: TreeItem) => {
    console.log("trash", trash);
  };
  const handleEmptyTrash = () => {
    console.log("empty trash");
  };
  const handleRestore = (trash: TreeItem) => {
    console.log("restore", trash);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">휴지통</h1>
          <p className="text-muted-foreground mt-1">
            삭제된 노트와 폴더를 관리할 수 있습니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/wisp/notes">
              <ArchiveRestore className="size-4 mr-2" />
              복원하기
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleEmptyTrash}>
            <Trash2 className="size-4 mr-2" />
            휴지통 비우기
          </Button>
        </div>
      </div>

      {/* 알림 */}
      <Alert>
        <AlertCircle className="size-4" />
        <AlertDescription>
          휴지통의 항목은 00일 후 자동으로 영구 삭제됩니다 ( 추가예정 )
        </AlertDescription>
      </Alert>

      {/* 메인 컨텐츠 */}
      <Card>
        <CardHeader>
          <CardTitle>삭제된 항목</CardTitle>
          <CardDescription>
            {trash.length > 0
              ? `총 ${trash.length}개의 항목이 있습니다`
              : "휴지통이 비어있습니다"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trash.length > 0 ? (
            <TrashTreeMenu
              items={trash}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              휴지통에 항목이 없습니다
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
