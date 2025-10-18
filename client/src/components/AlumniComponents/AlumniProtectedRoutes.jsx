// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AlumniProtectedRoutes = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("alumni-token"); // ✅ reads live

  if (!isAuthenticated) {
    return <Navigate to="/alumni-auth" replace />;
  }
  return element;
};

export default AlumniProtectedRoutes;
