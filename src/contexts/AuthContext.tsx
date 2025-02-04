"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import {
  User,
  AuthContextType,
} from "../utils/interfaces/authContextInterfaces";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setUser } from '../redux/authSlice';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useState<User | null>(null);
  const dispatch = useDispatch();
  const [candidateUser, setCandidateUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { hardcodedEmail, hardcodedPassword } = useSelector(selectAuth);

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
    const token = Cookies.get("token");
    if (user?.email && pathname.startsWith("/auth")) {
      debugger;
      if (token == "") {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, pathname, router]);

  const login = (userData: User) => {
    if (userData && userData.email && userData.password) {
      if (userData.email !== hardcodedEmail || userData.password !== hardcodedPassword) {
        toast.error("Invalid email or password");
      } else {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/dashboard");
      }
    } else {
      toast.error("Invalid user data");
    }
  };

  const candidateLogin = (userData: User) => {
    setCandidateUser(userData);
    localStorage.setItem("candidateUser", JSON.stringify(userData));
  };

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("user");
    toast.success("LogOut Successfully");
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
