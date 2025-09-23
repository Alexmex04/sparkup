// frontend/src/utils/api.js
import axios from "axios";

const onRender =
  typeof window !== "undefined" && window.location.hostname.endsWith("onrender.com");

const fallback = onRender
  ? "https://sparkup-6ood.onrender.com/api"
  : "http://localhost:5000/api";

const API_BASE = (import.meta.env.VITE_API_URL || fallback).replace(/\/$/, "");

const ROOT_BASE = API_BASE.replace(/\/api$/, "");

// Clientes axios
export const api = axios.create({ baseURL: API_BASE });
export const rootApi = axios.create({ baseURL: ROOT_BASE });

// Interceptor para adjuntar JWT si existe
const attachAuth = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
api.interceptors.request.use(attachAuth);
rootApi.interceptors.request.use(attachAuth);

export default api;
