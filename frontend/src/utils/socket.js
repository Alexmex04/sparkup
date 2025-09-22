// src/utils/socket.js
import { io } from "socket.io-client";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const wsUrl = import.meta.env.VITE_WS_URL || api.replace(/\/api\/?$/, "");

export const socket = io(wsUrl, { withCredentials: true });

export const joinUserRoom = (userId) => {
  if (userId) socket.emit("join:user", userId);
};
