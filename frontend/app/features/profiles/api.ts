import { makeSSRClient } from "~/supa-client";
import { jwtDecode } from "jwt-decode";
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

let sessionCache: { token: string | null } | null = null;

export async function getToken(request: Request): Promise<string | null> {
  const cached = sessionCache?.token;
  if (cached) {
    try {
      const { exp } = jwtDecode<{ exp: number }>(cached);
      const now = Math.floor(Date.now() / 1000);
      if (exp > now) {
        return cached;
      } else {
      }
    } catch (err) {}
  }

  // 토큰이 없거나 만료됐으면 새로 요청
  const { client } = makeSSRClient(request);
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token ?? null;

  sessionCache = { token };

  return token;
}
