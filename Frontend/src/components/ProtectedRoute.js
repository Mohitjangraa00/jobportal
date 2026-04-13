import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  })();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "recruiter") return <Navigate to="/employer/dashboard" replace />;
    if (user.role === "user") return <Navigate to="/candidate/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;