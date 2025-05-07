export type TreeItem = {
  id: string;
  parentId: string | null;
  type: "folder" | "note";
  name: string;
};
