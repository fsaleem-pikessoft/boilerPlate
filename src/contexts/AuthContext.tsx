"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import {
  User,
  AuthContextType,
} from "../utils/interfaces/authContextInterfaces";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [candidateUser, setCandidateUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.email && pathname.startsWith("/auth")) {
      if (user?.organizationId == null) {
        router.push("/lets-go");
      } else {
        router.push("/company-details");
      }
    }
  }, [user, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData?.organizationId == null) {
      router.push("/lets-go");
    } else {
      router.push("/company-details");
    }
  };

  const candidateLogin = (userData: User) => {
    setCandidateUser(userData);
    localStorage.setItem("candidateUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (loading) {
    return <LoadingSpinner isVisible={true} />;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, candidateLogin, logout, loading, candidateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
