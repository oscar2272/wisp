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

export default function trashBuildTree(items: TreeItem[]): TreeNode[] {
  const itemMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // 초기 매핑
  for (const item of items) {
    itemMap.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = itemMap.get(item.id)!;

    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId)!.children!.push(node);
    } else {
      // parent가 없거나 삭제되지 않은 폴더인 경우
      roots.push(node);
    }
  }

  return roots;
}
