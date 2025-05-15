import type { JSONContent } from "@tiptap/core";

export type TreeItem = {
  id: string;
  parentId: string | null;
  type: "folder" | "note";
  name: string;
};

export type Note = {
  id: string;
  author: string;
  file_name: string;
  title: string;
  content: JSONContent;
  likes_count: number;
  slug?: string;
  is_shared: boolean;
  shared_at?: string | null;
  is_public: boolean;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
  comments_count: number;
};

export type SharedNote = {
  id: string;
  title: string;
  content: JSONContent;
  author: {
    name: string;
    avatar: string;
  };
  likes_count: number;
  comments_count: number;
  seen_count: number;
  updated_at: string;
  expires_at: string;
  shared_at: string;
};

export type EditNote = {
  title: string;
  content: JSONContent;
};

export type NoteList = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  content: JSONContent;
  likes_count: number;
  seen_count: number;
  comments_count: number;
  updated_at: string;
  expires_at: string | null;
};
