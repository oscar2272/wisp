import type { UserProfile } from "./type";
import { makeSSRClient } from "~/supa-client";
// app/features/profiles/api.ts
const BASE_URL = "http://127.0.0.1:8000/";
const USER_API_URL = `${BASE_URL}/api/user`;

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

export async function getToken(request: Request) {
  const { client } = makeSSRClient(request);
  const { data } = await client.auth.getSession();
  return data.session?.access_token ?? null;
}
