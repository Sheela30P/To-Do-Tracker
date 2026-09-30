import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const value = {
    isLoggedIn,
    setLoggedIn,
    
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
