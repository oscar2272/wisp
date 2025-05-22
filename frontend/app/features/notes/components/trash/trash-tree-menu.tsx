// components/sidebar-tree-menu.tsx
import type { TreeItem } from "../../type";
import { useMemo } from "react";
import { SidebarMenu } from "~/common/components/ui/sidebar";
import { TrashTreeNode } from "./trash-tree-node";
import trashBuildTree from "../../utils/build-tree";

interface TrashTreeMenuProps {
  items: TreeItem[];
  // onDelete?: (item: TreeItem) => void;
  // onRestore?: (item: TreeItem) => void;
}

export function TrashTreeMenu({
  items,
}: // onDelete,
// onRestore,
TrashTreeMenuProps) {
  const tree = useMemo(() => trashBuildTree(items), [items]);

  return (
    <SidebarMenu>
      {tree.map((node) => (
        <TrashTreeNode
          key={node.id}
          node={node}
          // onDelete={onDelete}
          // onRestore={onRestore}
        />
      ))}
    </SidebarMenu>
  );
}
