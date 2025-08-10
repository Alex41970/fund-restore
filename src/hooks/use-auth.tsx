import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  isAdmin: boolean;
  isClient: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | void>;
  signUp: (email: string, password: string, userData?: { firstName: string; lastName: string; phoneNumber: string }) => Promise<{ error: any } | void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    // 1) Register listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch roles in a deferred way to avoid deadlocks
      if (session?.user) {
        const userId = session.user.id;
        setTimeout(async () => {
          const { data, error } = await (supabase as any)
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);
          if (!error && data) {
            setRoles((data as any[]).map((r) => (r as any).role as string));
          } else {
            setRoles([]);
          }
        }, 0);
      } else {
        setRoles([]);
      }
    });

    // 2) Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        const userId = session.user.id;
        setTimeout(async () => {
          const { data, error } = await (supabase as any)
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);
          if (!error && data) setRoles((data as any[]).map((r) => (r as any).role as string));
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: { firstName: string; lastName: string; phoneNumber: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: {
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          phone_number: userData?.phoneNumber,
          display_name: userData ? `${userData.firstName} ${userData.lastName}` : undefined,
        }
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    roles,
    isAdmin: roles.includes("admin"),
    isClient: roles.includes("user") || (!roles.includes("admin") && roles.length > 0),
    signIn,
    signUp,
    signOut,
  }), [user, session, loading, roles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
