"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile()
      .then((res) => setAdmin(res.data))
      .catch(() => {
        localStorage.removeItem("admin_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem("admin_token", token);
    setAdmin(adminData);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
