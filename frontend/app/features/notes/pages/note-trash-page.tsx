import {
  Link,
  redirect,
  useFetcher,
  useOutletContext,
  useRevalidator,
} from "react-router";
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
import type { Route } from "./+types/note-trash-page";
import { emptyTrash, restoreTrash } from "../api";
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const token = await client.auth
    .getSession()
    .then((r) => r.data.session?.access_token);
  if (!token) {
    return redirect("/auth/login");
  }
};
export async function action({ request }: Route.ActionArgs) {
  const { client } = makeSSRClient(request);
  const token = await client.auth
    .getSession()
    .then((r) => r.data.session?.access_token);
  if (!token) {
    return { error: "Unauthorized" };
  }
  if (request.method === "DELETE") {
    await emptyTrash(token!);
  }
  if (request.method === "PATCH") {
    const res = await restoreTrash(token!);
  }
}

export default function NoteTrashPage() {
  const { revalidate } = useRevalidator();
  const fetcher = useFetcher();
  const { trash } = useOutletContext() as {
    trash: TreeItem[];
  };

  const handleRestoreAll = () => {
    fetcher.submit(
      { action: "restore_all" },
      {
        method: "patch",
      }
    );
    setTimeout(() => {
      revalidate();
    }, 500);
  };
  const handleEmptyTrash = () => {
    fetcher.submit({ action: "empty_trash" }, { method: "delete" });
  };
  const handleDelete = (trash: TreeItem) => {};
  const handleRestore = (trash: TreeItem) => {};
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
          <Button variant="outline" onClick={() => handleRestoreAll()}>
            <ArchiveRestore className="size-4 mr-2" />
            복원하기
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
        <CardContent className="h-96 overflow-y-scroll custom-scrollbar">
          {trash.length > 0 ? (
            <TrashTreeMenu
              items={trash}
              //onDelete={handleDelete}
              //onRestore={handleRestore}
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
