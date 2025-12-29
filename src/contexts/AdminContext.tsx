import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface AdminContextType {
  isAdmin: boolean;
  adminUser: User | null;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  checkAdminStatus: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin based on credentials
  const checkAdminStatus = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET_KEY;
    
    // Check localStorage for admin session
    const storedAdminData = localStorage.getItem('ember_grill_admin_session');
    
    if (storedAdminData) {
      try {
        const adminData = JSON.parse(storedAdminData);
        const now = Date.now();
        
        // Check if session is still valid (24 hours)
        if (now - adminData.timestamp < 24 * 60 * 60 * 1000) {
          setIsAdmin(true);
          return true;
        } else {
          // Session expired, remove it
          localStorage.removeItem('ember_grill_admin_session');
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('ember_grill_admin_session');
      }
    }
    
    return false;
  };

  // Login admin
  const loginAdmin = async (email: string, password: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET_KEY;

    // Validate credentials
    if (email === adminEmail && password === adminPassword) {
      // Create admin session
      const adminSession = {
        email,
        secret: adminSecret,
        timestamp: Date.now(),
        role: 'admin'
      };
      
      // Store in localStorage
      localStorage.setItem('ember_grill_admin_session', JSON.stringify(adminSession));
      
      setIsAdmin(true);
      return { success: true };
    }
    
    return { success: false, error: 'Identifiants administrateurs invalides' };
  };

  // Logout admin
  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminUser(null);
    localStorage.removeItem('ember_grill_admin_session');
  };

  // Check admin status on mount
  useEffect(() => {
    const isAdminUser = checkAdminStatus();
    setIsLoading(false);
  }, []);

  const value: AdminContextType = {
    isAdmin,
    adminUser,
    isLoading,
    loginAdmin,
    logoutAdmin,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
