// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAuthenticated }) => {
  if (!isAuthenticated) {
    // If not logged in → stay on HomePage ("/")
    return <Navigate to="/login" replace />;
  }

  // If logged in → render the protected component
  return element;
};

export default ProtectedRoute;
