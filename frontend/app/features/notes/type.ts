export type TreeItem = {
  id: string;
  parentId: string | null;
  type: "folder" | "note";
  name: string; // 폴더면 file_name, 노트면 title을 겸용
  created_at: string;
  updated_at: string;
  content?: string; // note일 경우만 존재
};
