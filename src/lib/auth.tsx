import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { signIn as apiSignIn } from "@/api/auth";

type AuthContextType = {
  session: Session | null;
  user:
    | (User & { role?: string; company_id?: string; company_name?: string })
    | null;
  signIn: (
    login: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  needsOnboarding: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => {},
  loading: true,
  needsOnboarding: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<
    | (User & { role?: string; company_id?: string; company_name?: string })
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);

        if (session?.user) {
          // Get additional user data from the database
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*, roles(name, permissions)")
            .eq("auth_id", session.user.id)
            .single();

          if (!userError && userData) {
            // Check if user needs onboarding
            const { data: storeData } = await supabase
              .from("user_stores")
              .select("*")
              .eq("user_id", userData.id);

            setNeedsOnboarding(storeData?.length === 0);

            // Get company name
            let companyName = "";
            if (userData.company_id) {
              try {
                const { data: companyData } = await supabase
                  .from("companies")
                  .select("name")
                  .eq("id", userData.company_id)
                  .single();

                if (companyData) {
                  companyName = companyData.name;
                }
              } catch (error) {
                console.error("Error fetching company name:", error);
              }
            }

            // Set user with role information and company name
            setUser({
              ...session.user,
              role: userData.roles?.name === "Admin" ? "admin" : "user",
              company_id: userData.company_id,
              company_name: companyName,
            });
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      },
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (login: string, password: string) => {
    try {
      const { data, error } = await apiSignIn(login, password);

      if (error) {
        return { error, data: null };
      }

      setSession(data.session);
      setUser(data.user);

      return { data: data.session, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, signIn, signOut, loading, needsOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
