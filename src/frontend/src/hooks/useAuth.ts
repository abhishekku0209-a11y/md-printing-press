import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "admin_session";
const SESSION_VALUE = "authenticated";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored === SESSION_VALUE) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (id: string, password: string) => {
    setError(null);
    if (id === "bindwala" && password === "bind@#$") {
      localStorage.setItem(SESSION_KEY, SESSION_VALUE);
      setIsAuthenticated(true);
    } else {
      setError("Invalid credentials. Please try again.");
      throw new Error("Invalid credentials");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
