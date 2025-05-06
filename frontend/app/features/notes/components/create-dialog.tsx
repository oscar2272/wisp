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
import { useState } from "react";

interface CreateDialogProps {
  type: "file" | "folder";
  parentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    type: "file" | "folder",
    name: string,
    parentId: string | null
  ) => void;
}

export function CreateDialog({
  type,
  parentId,
  open,
  onOpenChange,
  onCreate,
}: CreateDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(type, name.trim(), parentId);
      onOpenChange(false);
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "folder" ? "새 폴더 만들기" : "새 파일 만들기"}
            </DialogTitle>
            <DialogDescription>
              {type === "folder" ? "폴더" : "파일"}의 이름을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "folder" ? "폴더 이름" : "파일 이름"}
              autoFocus
            />
          </div>
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
            <Button type="submit">만들기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
