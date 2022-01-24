import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { supabase } from "utils/supabaseClient";

interface AuthSessionProps {
  user: User | null;
  session: Session | null;
  profile?: Profile;
  loading: boolean;
  refresh: any;
}
const UserContext = createContext<AuthSessionProps>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refresh: null,
});

interface Props {
  [propName: string]: any;
}

export const UserContextProvider = (props: Props): JSX.Element => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const {
    data: profile,
    error,
    isValidating,
    mutate,
  } = useSWR(
    user?.id ? ["user_data", user.id] : null,
    async (_, userId) =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        }),
    { revalidateOnFocus: false }
  );

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    const session = supabase.auth.session();

    if (session) {
      setSession(session);
      setUser(session?.user ?? null);
    }

    const { data: authListener, error } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    if (error) {
      throw error;
    }

    return () => {
      authListener!.unsubscribe();
    };
  }, []);

  const loading = !session || !user || isValidating;

  const value = {
    session,
    user,
    profile,
    loading,
    refresh: mutate,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = (): AuthSessionProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
