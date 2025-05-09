import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/common/components/ui/context-menu";
import { Trash2, RotateCcw } from "lucide-react";
import type { TreeItem } from "../../type";

interface TrashContextMenuProps {
  children: React.ReactNode;
  item: TreeItem;
  onDelete?: (item: TreeItem) => void;
  onRestore?: (item: TreeItem) => void;
}

export function TrashContextMenu({
  children,
  item,
  onDelete,
  onRestore,
}: TrashContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onRestore?.(item)}>
          <RotateCcw className="mr-2 size-4" />
          복원하기
        </ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onDelete?.(item)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 size-4" />
          영구 삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
