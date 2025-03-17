// src/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";

interface PrivateRouteProps {
  requiredPermissions: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredPermissions }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to the "Not Authorized" page.
  const hasPermission = requiredPermissions.some((perm) =>
    user.permissions.includes(perm)
  );

  if (!hasPermission) {
    return <Navigate to="/not-authorized" replace />;
  }

  // If authorized, render the child routes.
  return <Outlet />;
};

export default PrivateRoute;
