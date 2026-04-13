import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage message="Verifying credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}
