import React, { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("token", "demo-token");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook (IMPORTANT: defined AFTER context)
export const useAuth = () => {
  return useContext(AuthContext);
};