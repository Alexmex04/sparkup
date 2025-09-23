// src/utils/socket.js
import { io } from "socket.io-client";

const onRender =
  typeof window !== "undefined" && window.location.hostname.endsWith("onrender.com");

const api =
  import.meta.env.VITE_API_URL ||
  (onRender ? "https://sparkup-6ood.onrender.com/api" : "http://localhost:5000/api");

const wsUrl = import.meta.env.VITE_WS_URL || api.replace(/\/api\/?$/, "");

// Si tu backend Socket.IO no usa cookies, puedes poner false para evitar CORS con credenciales
export const socket = io(wsUrl, { withCredentials: true });

export const joinUserRoom = (userId) => {
  if (userId) socket.emit("join:user", userId);
};
