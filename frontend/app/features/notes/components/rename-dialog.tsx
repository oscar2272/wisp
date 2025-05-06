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
import type { TreeItem } from "../type";
import { Form } from "react-router";

interface RenameDialogProps {
  item: TreeItem | null;
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
  const [name, setName] = useState(item?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && name.trim()) {
      onRename(item, name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogDescription>
              {item?.type === "folder" ? "폴더" : "파일"}의 새 이름을
              입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="새 이름"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">변경</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
