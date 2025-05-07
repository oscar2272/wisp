import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import type { TreeItem } from "../type";
import { useFetcher } from "react-router";
import { useToken } from "~/context/token-context";
interface DeleteDialogProps {
  item: TreeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (item: TreeItem) => void;
}

export function DeleteDialog({
  item,
  open,
  onOpenChange,
  onDelete,
}: DeleteDialogProps) {
  if (!item) return null;
  const token = useToken();
  const fetcher = useFetcher();
  const handleDelete = () => {
    if (!item) return;

    fetcher.submit(
      { id: item.id, token },
      {
        method: "delete",
        action: "/api/notes-action",
      }
    );

    onDelete(item);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
          <DialogDescription>
            {item?.type === "folder"
              ? "이 폴더와 모든 하위 항목이 삭제됩니다."
              : "이 파일이 삭제됩니다."}
            <br />
            계속하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
