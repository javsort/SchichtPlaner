// src/RequireAuth.js
import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to the not-authorized page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default RequireAuth;
