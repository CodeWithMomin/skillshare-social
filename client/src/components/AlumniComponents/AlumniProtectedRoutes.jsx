// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAlumniAuth } from "../../AlumniConnect/alumniContext/AlumniAuthContext";
const AlumniProtectedRoutes = ({ element }) => {
   const {isAlumniAuthenticated}=useAlumniAuth()
   
  if (!isAlumniAuthenticated) {
    return <Navigate to="/alumni-auth" replace />;
  }
  return element;
};

export default AlumniProtectedRoutes;
