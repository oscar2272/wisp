// utils/session.ts

import { createServerClient } from "@supabase/ssr";

let sessionCache: { token: string | null; timestamp: number } | null = null;
const TTL = 30 * 1000; // 30초 캐시

export async function getCachedToken(request: Request): Promise<string | null> {
  const now = Date.now();

  if (sessionCache && now - sessionCache.timestamp < TTL) {
    return sessionCache.token;
  }

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request }
  );

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? null;

  sessionCache = {
    token,
    timestamp: now,
  };

  return token;
}
