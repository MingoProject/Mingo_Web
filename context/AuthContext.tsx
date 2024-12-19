"use client";
import { updateUserStatus } from "@/lib/services/user.service";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextProps {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);

  const logout = async () => {
    const token = localStorage.getItem("token");
    await updateUserStatus(token);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setProfile(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (token && loginTime) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - Number(loginTime);

      if (elapsedTime > 2 * 60 * 60 * 1000) {
        logout();
      } else {
        const timeout = setTimeout(logout, 2 * 60 * 60 * 1000 - elapsedTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [profile]);

  return (
    <AuthContext.Provider value={{ profile, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
