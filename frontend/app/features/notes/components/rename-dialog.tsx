import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { useEffect, useState } from "react";
import type { TreeItem } from "../type";
import { Form, useFetcher } from "react-router";
import { useToken } from "~/context/token-context";
import { LoaderIcon } from "lucide-react";
import { Alert } from "~/common/components/ui/alert";

interface RenameDialogProps {
  type?: "note" | "folder";
  item?: TreeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (item: TreeItem, newName: string) => void;
}

export function RenameDialog({
  item,
  open,
  onOpenChange,
  onRename,
}: RenameDialogProps) {
  const token = useToken();
  const [name, setName] = useState("");
  const fetcher = useFetcher();
  const isSuccess =
    fetcher.state === "idle" && fetcher.data && fetcher.data.success === true;
  useEffect(() => {
    if (isSuccess) {
      const { id, name } = fetcher.data;
      onRename(item!, name.trim()); // ✅ 서버 id 전달
      onOpenChange(false);
      setName(""); // cleanup
    }
  }, [isSuccess, fetcher.data]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("폼 제출 시도");

    fetcher.submit(
      { name, id: item!.id, token },
      {
        method: "patch",
        action: "/api/notes-action",
        encType: "application/x-www-form-urlencoded",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogDescription>
              {item?.type === "folder" ? "폴더" : "파일"}의 새 이름을
              입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input type="hidden" name="id" value={item?.id} />
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={item?.type === "folder" ? "폴더 이름" : "문서 이름"}
              autoFocus
            />
          </div>
          {fetcher.data?.fieldErrors?.name && (
            <Alert variant="destructive" className="flex flex-row mb-2">
              <div className="text-sm text-red-500">
                {fetcher.data.fieldErrors.name.join(", ")}
              </div>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                onOpenChange(false);
                setName("");
              }}
            >
              취소
            </Button>
            <Button type="submit" disabled={fetcher.state !== "idle"}>
              {fetcher.state === "submitting" ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                "변경"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
