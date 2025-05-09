import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Button } from "~/common/components/ui/button";
import { Edit, FileText, FolderIcon } from "lucide-react";
import type { TreeItem } from "../../type";
import { SidebarMenuButton } from "~/common/components/ui/sidebar";

export function NotePopover({
  items,
  onCreateFileDialog,
  onCreateFolderDialog,
}: {
  items: TreeItem[];
  onCreateFileDialog: (parentId: string | null) => void;
  onCreateFolderDialog: (parentId: string | null) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex flex-col gap-2 items-center">
          {/* 파일 생성 버튼 */}
          <SidebarMenuButton
            variant="default"
            onClick={() => onCreateFileDialog(null)}
          >
            <FileText className="size-4" />
            <span>파일 생성</span>
          </SidebarMenuButton>
          {/* 폴더 생성 버튼 */}
          <SidebarMenuButton
            variant="default"
            onClick={() => onCreateFolderDialog(null)}
          >
            <FolderIcon className="size-4" />
            <span>폴더 생성</span>
          </SidebarMenuButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
