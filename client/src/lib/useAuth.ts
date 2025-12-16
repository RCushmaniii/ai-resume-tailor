import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, AuthError, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export function useAuth() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let ignore = false;

    supabase.auth
      .getSession()
      .then(({ data, error }: { data: { session: Session | null }; error: AuthError | null }) => {
        if (ignore) return;
        if (error) {
          setSession(null);
          setUser(null);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      }
    );

    return () => {
      ignore = true;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    enabled: Boolean(supabase),
    loading,
    session,
    user,
    supabase,
  };
}
