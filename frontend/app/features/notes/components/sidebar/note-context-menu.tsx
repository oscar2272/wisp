import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/common/components/ui/context-menu";
import { FileText, FolderIcon, Pencil, Trash2 } from "lucide-react";
import type { TreeItem } from "../type";

interface NoteContextMenuProps {
  children: React.ReactNode;
  item: TreeItem;
  onRename?: (item: TreeItem) => void;
  onDelete?: (item: TreeItem) => void;
  onCreateFileDialog?: (parentId: string | null) => void;
  onCreateFolderDialog?: (parentId: string | null) => void;
}

export function NoteContextMenu({
  children,
  item,
  onRename,
  onDelete,
  onCreateFileDialog,
  onCreateFolderDialog,
}: NoteContextMenuProps) {
  const isFolder = item.type === "folder";
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onRename?.(item)}>
          <Pencil className="mr-2 size-4" />
          이름 변경
        </ContextMenuItem>

        {isFolder && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onCreateFileDialog?.(item.id)}>
              <FileText className="mr-2 size-4" />
              파일 생성
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onCreateFolderDialog?.(item.id)}>
              <FolderIcon className="mr-2 size-4" />
              폴더 생성
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onDelete?.(item)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 size-4" />
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
