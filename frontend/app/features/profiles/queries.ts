import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";

export const getLoggedInUserId = async (client: SupabaseClient) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    return null;
  }
  return data.user.id;
};
