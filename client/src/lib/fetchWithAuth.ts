import { getSupabaseClient } from "@/lib/supabaseClient";

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const supabase = getSupabaseClient();

  let accessToken: string | null = null;
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    accessToken = data.session?.access_token ?? null;
  }

  const headers = new Headers(init?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
