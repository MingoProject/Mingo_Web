"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setProfile(null);
  };

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
