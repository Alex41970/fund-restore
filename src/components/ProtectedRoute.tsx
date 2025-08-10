import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireClient?: boolean;
}> = ({ children, requireAdmin, requireClient }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Admin-only route accessed by non-admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Client-only route accessed by admin
  if (requireClient && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
