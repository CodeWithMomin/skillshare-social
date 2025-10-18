// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AlumniProtectedRoutes = ({ element, isAlumniAuthenticated }) => {
  console.log(isAlumniAuthenticated);
  if (!isAlumniAuthenticated) {
   
    
    return <Navigate to="/alumni-auth" replace />;
  }
   // If logged in → render the protected component
  return element;
};

export default AlumniProtectedRoutes;
