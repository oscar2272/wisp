// components/sidebar-tree-menu.tsx
import { SidebarMenu } from "~/common/components/ui/sidebar";
import { buildTree } from "../utils/build-tree";
import type { TreeItem } from "../type";
import { useMemo } from "react";
import { SidebarTreeNode } from "./sidebar-tree-node";

interface SidebarTreeMenuProps {
  items: TreeItem[];
  onRename?: (item: TreeItem) => void;
  onDelete?: (item: TreeItem) => void;
  onCreateFileDialog?: (parentId: string | null) => void;
  onCreateFolderDialog?: (parentId: string | null) => void;
}

export function SidebarTreeMenu({
  items,
  onRename,
  onDelete,
  onCreateFileDialog,
  onCreateFolderDialog,
}: SidebarTreeMenuProps) {
  const tree = useMemo(() => buildTree(items), [items]);

  return (
    <SidebarMenu>
      {tree.map((node) => (
        <SidebarTreeNode
          key={node.id}
          node={node}
          onRename={onRename}
          onDelete={onDelete}
          onCreateFileDialog={onCreateFileDialog}
          onCreateFolderDialog={onCreateFolderDialog}
        />
      ))}
    </SidebarMenu>
  );
}
