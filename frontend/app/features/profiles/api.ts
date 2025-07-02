// app/features/profiles/api.ts
const BASE_URL = process.env.VITE_API_BASE_URL;
if (!BASE_URL) {
  throw new Error("❌ VITE_API_BASE_URL is not defined");
}
const USER_API_URL = `${BASE_URL}/api/users`;

export async function SignInOrSignUp(token: string) {
  const res = await fetch(`${USER_API_URL}/sync/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("User sync failed");
  }
}

export async function getUserProfile(token: string) {
  const res = await fetch(`${USER_API_URL}/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

export async function updateUserProfile(
  token: string,
  avatar: File | null,
  name: string
) {
  const formData = new FormData();
  if (avatar) {
    formData.append("avatar", avatar);
  }
  formData.append("name", name);
  const res = await fetch(`${USER_API_URL}/me/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }
  return res.status;
}

export async function getUserProfileWithEmail(token: string) {
  const res = await fetch(`${USER_API_URL}/me/readonly/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile with email");
  }
  return res.json();
}

export function clearSessionCache() {
  sessionCache = null;
}
let sessionCache: { token: string | null } | null = null;

export async function checkNickname(nickname: string): Promise<boolean> {
  const res = await fetch(`${USER_API_URL}/check-nickname/${nickname}/`);
  if (!res.ok) {
    throw new Error("닉네임 중복확인 실패");
  }
  const result = await res.json();

  return result.exists;
}

export async function signupWithPassword(
  email: string,
  nickname: string,
  token: string
): Promise<{ error?: string }> {
  const res = await fetch(`${USER_API_URL}/signup/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, nickname }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return { error: errorData.message || "회원가입 실패" };
  }
  return {};
}
