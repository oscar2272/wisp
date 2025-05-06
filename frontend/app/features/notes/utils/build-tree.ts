// utils/tree.ts
import type { TreeItem } from "../type";

export type TreeNode = TreeItem & {
  children?: TreeNode[];
};

export function buildTree(items: TreeItem[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children!.push(map.get(item.id)!);
      }
    } else {
      roots.push(map.get(item.id)!);
    }
  }

  return roots;
}
