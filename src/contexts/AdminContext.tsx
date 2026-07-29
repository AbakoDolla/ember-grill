import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

type AdminRole = "admin" | "staff";

interface AdminContextType {
  isAdmin: boolean;
  adminUser: User | null;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};

async function getAdminRole(user: User): Promise<AdminRole | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || (data.role !== "admin" && data.role !== "staff")) {
    return null;
  }

  return data.role;
}

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAdminState = useCallback(() => {
    setIsAdmin(false);
    setAdminUser(null);
  }, []);

  const checkAdminStatus = useCallback(async () => {
    if (!supabase) {
      clearAdminState();
      return false;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      clearAdminState();
      return false;
    }

    const role = await getAdminRole(data.user);
    if (!role) {
      clearAdminState();
      return false;
    }

    setAdminUser(data.user);
    setIsAdmin(true);
    return true;
  }, [clearAdminState]);

  const loginAdmin = async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: "La configuration Supabase est indisponible." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      clearAdminState();
      return { success: false, error: error?.message || "Connexion impossible." };
    }

    const role = await getAdminRole(data.user);
    if (!role) {
      await supabase.auth.signOut();
      clearAdminState();
      return { success: false, error: "Ce compte ne possède pas les droits administrateur." };
    }

    setAdminUser(data.user);
    setIsAdmin(true);
    return { success: true };
  };

  const logoutAdmin = async () => {
    if (supabase) await supabase.auth.signOut();
    clearAdminState();
  };

  useEffect(() => {
    let isMounted = true;

    void checkAdminStatus().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [checkAdminStatus]);

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, isLoading, loginAdmin, logoutAdmin, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};
