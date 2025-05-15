const BASE_URL = "http://127.0.0.1:8000";
const USER_API_URL = `${BASE_URL}/api/notes`;

export async function getNoteList() {
  const res = await fetch(`${USER_API_URL}/explore/`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to get note list");
  }
  return res.json();
}
export async function getSharedNote(id: string) {
  const response = await fetch(`${USER_API_URL}/explore/${id}/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("공유된 노트를 가져오는데 실패했습니다.");
  }

  return response.json();
}
