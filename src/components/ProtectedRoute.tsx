import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
