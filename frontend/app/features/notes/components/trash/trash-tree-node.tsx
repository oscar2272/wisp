import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/common/components/ui/sidebar";
import { FileText, FolderIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { TreeNode } from "../../utils/build-tree";
import { TrashContextMenu } from "./trash-context-menu";

interface Props {
  node: TreeNode;
  onDelete?: (item: TreeNode) => void;
  onRestore?: (item: TreeNode) => void;
}

export function TrashTreeNode({ node, onDelete, onRestore }: Props) {
  const isFolder = node.type === "folder";
  const hasChildren = node.children && node.children.length > 0;
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <TrashContextMenu item={node} onDelete={onDelete} onRestore={onRestore}>
        <SidebarMenuButton
          onClick={() => isFolder && setIsFolderOpen(!isFolderOpen)}
        >
          {isFolder ? (
            <>
              <FolderIcon className="size-4" />
              <span>{node.name}</span>
              {hasChildren && (
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                    isFolderOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </>
          ) : (
            <>
              <FileText className="size-4" />
              <span>{node.name}</span>
            </>
          )}
        </SidebarMenuButton>
      </TrashContextMenu>

      {isFolderOpen && hasChildren && (
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            {node.children!.map((child) => (
              <TrashTreeNode
                key={child.id}
                node={child}
                onDelete={onDelete}
                onRestore={onRestore}
              />
            ))}
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
