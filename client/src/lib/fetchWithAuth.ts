/**
 * Fetch wrapper that attaches Clerk auth token.
 *
 * Usage: Must be called with a getToken function from useAuth().
 * For standalone use, see fetchWithAuthToken() below.
 */

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
  getToken?: () => Promise<string | null>
): Promise<Response> {
  let accessToken: string | null = null;

  if (getToken) {
    accessToken = await getToken();
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

/**
 * Create a fetch function pre-bound with a token getter.
 */
export function createAuthFetch(getToken: () => Promise<string | null>) {
  return (input: RequestInfo | URL, init?: RequestInit) =>
    fetchWithAuth(input, init, getToken);
}
