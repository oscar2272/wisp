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
import { useFetcher } from "react-router";
import { useToken } from "~/context/token-context";
import { Alert } from "~/common/components/ui/alert";
import { LoaderIcon } from "lucide-react";
interface CreateDialogProps {
  type: "note" | "folder";
  parentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    type: "note" | "folder",
    name: string,
    parentId: string | null,
    id: string
  ) => void;
}

export function CreateDialog({
  type,
  parentId,
  open,
  onOpenChange,
  onCreate,
}: CreateDialogProps) {
  const token = useToken();
  const [name, setName] = useState("");
  const fetcher = useFetcher();
  const isSuccess =
    fetcher.state === "idle" && fetcher.data && fetcher.data.success === true;
  useEffect(() => {
    if (isSuccess) {
      const { id, name, type, parentId } = fetcher.data;
      onCreate(type, name, parentId, id); // ✅ 서버 id 전달
      onOpenChange(false);
      setName(""); // cleanup
    }
  }, [isSuccess, fetcher.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    fetcher.submit(
      { name, parentId: parentId ?? "", type, token },
      {
        method: "post",
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
            <DialogTitle>
              {type === "folder" ? "새 폴더 만들기" : "새 문서 만들기"}
            </DialogTitle>
            <DialogDescription>
              {type === "folder" ? "폴더" : "문서"}의 이름을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="parentId" value={parentId ?? ""} />
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "folder" ? "폴더 이름" : "문서 이름"}
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
                "만들기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
