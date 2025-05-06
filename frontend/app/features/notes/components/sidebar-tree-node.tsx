// components/sidebar-tree-node.tsx
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/common/components/ui/sidebar";
import { FileText, FolderIcon, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { NoteContextMenu } from "./note-context-menu";
import type { TreeNode } from "../utils/build-tree";

interface Props {
  node: TreeNode;
  onRename?: (item: TreeNode) => void;
  onDelete?: (item: TreeNode) => void;
  onCreateFileDialog?: (parentId: string | null) => void;
  onCreateFolderDialog?: (parentId: string | null) => void;
}

export function SidebarTreeNode({
  node,
  onRename,
  onDelete,
  onCreateFileDialog,
  onCreateFolderDialog,
}: Props) {
  const isFolder = node.type === "folder";
  const hasChildren = node.children && node.children.length > 0;
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <NoteContextMenu
        item={node}
        onRename={onRename}
        onDelete={onDelete}
        onCreateFileDialog={onCreateFileDialog}
        onCreateFolderDialog={onCreateFolderDialog}
      >
        <SidebarMenuButton
          onClick={() => isFolder && setIsFolderOpen(!isFolderOpen)}
          asChild={!isFolder}
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
            <Link to={`/wisp/notes/${node.id}`}>
              <FileText className="size-4" />
              <span>{node.name}</span>
            </Link>
          )}
        </SidebarMenuButton>
      </NoteContextMenu>

      {isFolderOpen && hasChildren && (
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            {node.children!.map((child) => (
              <SidebarTreeNode
                key={child.id}
                node={child}
                onRename={onRename}
                onDelete={onDelete}
                onCreateFileDialog={onCreateFileDialog}
                onCreateFolderDialog={onCreateFolderDialog}
              />
            ))}
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
