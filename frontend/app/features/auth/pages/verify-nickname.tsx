// app/routes/api/check-nickname.ts

import { checkNickname } from "~/features/profiles/api";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const nickname = url.searchParams.get("nickname");

  if (!nickname) {
    return new Response(JSON.stringify({ error: "닉네임이 없습니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const exists = await checkNickname(nickname);
  return new Response(JSON.stringify({ exists }), {
    headers: { "Content-Type": "application/json" },
  });
};
