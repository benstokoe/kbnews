import { User } from "@supabase/supabase-js";
import React, { useContext, useState, useEffect } from "react";
import { supabase } from "utils/supabaseClient";

type AuthContext = {
  signUp?: (data: SignUp) => void;
  signIn?: (data: SignIn) => void;
  signOut?: () => void;
  user?: User;
  profile?: Profile;
  loading?: boolean;
};

type Profile = {
  username: string;
};

type SignIn = {
  email: string;
  password: string;
};

type SignUp = SignIn & {
  username: string;
};

const AuthContext = React.createContext<AuthContext>({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();

    setUser(session?.user ?? null);
    getProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", user.id)
        .single();

      // if (error && status !== 406) {
      //   throw error;
      // }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    signUp: (data: SignUp) => supabase.auth.signUp(data),
    signIn: (data: SignIn) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
