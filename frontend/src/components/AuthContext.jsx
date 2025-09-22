import React, { createContext, useState, useEffect } from "react";
import { socket, joinUserRoom } from "../utils/socket.js";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  useEffect(() => {
    if (user?.id) joinUserRoom(user.id);
  }, [user?.id]);

  useEffect(() => {
  const onLikes = (payload) => {
    // aquí solo observamos; el refresco real lo haremos con el hook de abajo
    // console.log("likes:updated", payload);
  };
  socket.on("likes:updated", onLikes);
  return () => socket.off("likes:updated", onLikes);
}, []);



  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (newData) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : newData));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
