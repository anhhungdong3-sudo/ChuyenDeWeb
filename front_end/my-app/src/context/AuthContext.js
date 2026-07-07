import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

const readUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readUser);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener("oldbookstore:auth-expired", handleExpired);
    return () => window.removeEventListener("oldbookstore:auth-expired", handleExpired);
  }, []);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      console.log(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", loggedInUser.token);
      localStorage.setItem("role", loggedInUser.role);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user?.token),
      isAdmin: String(user?.role || "").toUpperCase() === "ADMIN",
      login,
      logout,
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
