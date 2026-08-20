import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const DEMO_USER_ID = "demo-user-id-12345";

export const DEMO_USER: User = {
  id: DEMO_USER_ID,
  app_metadata: { provider: "email" },
  user_metadata: { name: "Alex Chen (Demo)", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "demo@algoflow.ai",
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInAsDemo: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDemo = typeof window !== "undefined" && localStorage.getItem("algoflow_demo_mode") === "true";
    if (isDemo) {
      setUser(DEMO_USER);
      setSession({
        access_token: "demo-token",
        refresh_token: "demo-refresh-token",
        expires_in: 86400,
        token_type: "bearer",
        user: DEMO_USER,
      });
      setLoading(false);
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (localStorage.getItem("algoflow_demo_mode") === "true") return;
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (localStorage.getItem("algoflow_demo_mode") === "true") return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    localStorage.removeItem("algoflow_demo_mode");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: window.location.origin + "/dashboard" },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    if (email.trim().toLowerCase() === "demo@algoflow.ai") {
      return signInAsDemo();
    }
    localStorage.removeItem("algoflow_demo_mode");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    localStorage.removeItem("algoflow_demo_mode");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) return { error: result.error instanceof Error ? result.error.message : String(result.error) };
    return { error: null };
  };

  const signInAsDemo = async () => {
    localStorage.setItem("algoflow_demo_mode", "true");
    setUser(DEMO_USER);
    setSession({
      access_token: "demo-token",
      refresh_token: "demo-refresh-token",
      expires_in: 86400,
      token_type: "bearer",
      user: DEMO_USER,
    });
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem("algoflow_demo_mode");
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signInAsDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
