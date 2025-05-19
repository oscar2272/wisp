import type { EditNote, Note } from "./type";
// app/features/profiles/api.ts
const BASE_URL = process.env.VITE_API_BASE_URL;

const USER_API_URL = `${BASE_URL}/api/notes`;

// 노트 사이드바 가져오기
export async function getNotesSidebar(token: string) {
  const res = await fetch(`${USER_API_URL}/sidebar/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch notes sidebar");
  }
  return res.json();
}

export async function createFolder(
  name: string,
  token: string,
  parentId?: string | null
) {
  const formData = new FormData();
  formData.append("name", name);
  if (parentId) {
    formData.append("parent_id", parentId);
  }
  const res = await fetch(`${USER_API_URL}/folder/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to create folder");
  }
  return res.json();
}

export async function deleteFolder(id: number, token: string) {
  const res = await fetch(`${USER_API_URL}/folder/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete folder");
  }
  return "success";
}
export async function createNote(
  name: string,
  token: string,
  parentId?: string | null
) {
  const formData = new FormData();
  formData.append("name", name);
  if (parentId) {
    formData.append("parent_id", parentId);
  }
  const res = await fetch(`${USER_API_URL}/note/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to create note");
  }
  return res.json();
}

export async function deleteNote(id: number, token: string) {
  const res = await fetch(`${USER_API_URL}/note/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
  return "success";
}

export async function renameFolder(id: string, name: string, token: string) {
  const res = await fetch(`${USER_API_URL}/folder/${id}/rename/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to rename folder");
  }
  return res.json();
}

export async function renameNote(id: string, name: string, token: string) {
  const res = await fetch(`${USER_API_URL}/note/${id}/rename/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to rename note");
  }
  return res.json();
}

export async function getTrash(token: string) {
  const res = await fetch(`${USER_API_URL}/trash/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get trash");
  }
  return res.json();
}

export async function permanentlyDeleteByParentId(
  parentId: string,
  token: string
) {
  const res = await fetch(`${USER_API_URL}/trash/${parentId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to permanently delete by parent id");
  }
  return res.json();
}

export async function getNote(
  id: string,
  token: string
): Promise<{ note: Note }> {
  const res = await fetch(`${USER_API_URL}/${id}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get note");
  }
  const data = await res.json();
  return { note: data };
}

export async function getEditNote(
  id: string,
  token: string
): Promise<{ note: EditNote }> {
  const res = await fetch(`${USER_API_URL}/${id}/edit/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get edit note");
  }
  const data = await res.json();
  return { note: data };
}

import type { JSONContent } from "@tiptap/core";

export async function updateNote(
  id: string,
  data: { title: string; content: JSONContent }, // ✅ JSONContent로 수정
  token: string
) {
  const res = await fetch(`${USER_API_URL}/${id}/edit/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Failed to update note");
  }

  return res.json();
}

export async function getUrl(id: string, token: string) {
  const res = await fetch(`${USER_API_URL}/${id}/slug/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get url");
  }
  return res.json();
}

export async function createUrl(id: string, token: string) {
  const res = await fetch(`${USER_API_URL}/${id}/slug/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to create url");
  }
  return res.json();
}

export async function patchShare(
  id: string,
  token: string,
  shareType: string,
  expiryDate?: string | null
) {
  const res = await fetch(`${USER_API_URL}/${id}/share/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareType, expiryDate }),
  });
  if (!res.ok) {
    throw new Error("Failed to patch share");
  }
  return res.json();
}

export async function getNoteHome(token: string, query: string) {
  const url = new URL(`${USER_API_URL}/home/${query}`);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get note list");
  }
  return res.json();
}
