import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setProfile(data);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user || null);

        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();
          setProfile(data);
        } else {
          setProfile(null);
        }

        setLoading(false);
      })();
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, profile };
}
