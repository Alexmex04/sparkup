// frontend/src/services/likes.js
import api from "../utils/api";

function hasToken() {
  return !!localStorage.getItem("token");
}

// ==== TAGS GUSTADOS ====
export async function getMyLikedTagIds() {
  if (!hasToken()) return new Set();        // <-- evita 403 sin sesión
  for (const path of ["/me/likes", "/me/likes/tags"]) {
    try {
      const { data } = await api.get(path);
      const arr =
        Array.isArray(data) ? data :
        Array.isArray(data?.tags) ? data.tags :
        Array.isArray(data?.likedTagIds) ? data.likedTagIds :
        [];
      return new Set(arr.map((x) => Number(x)));
    } catch {}
  }
  return new Set();
}

export async function likeTag(tagId) {
  if (!hasToken()) throw new Error("No session");
  const { data } = await api.post(`/me/likes/tag/${encodeURIComponent(String(tagId))}`);
  return data;
}

export async function unlikeTag(tagId) {
  if (!hasToken()) throw new Error("No session");
  const { data } = await api.delete(`/me/likes/tag/${encodeURIComponent(String(tagId))}`);
  return data;
}

// ==== ROADMAPS GUSTADOS ====
export async function getMyLikedRoadmapIds() {
  if (!hasToken()) return new Set();        // <-- evita 403 sin sesión
  for (const path of ["/me/likes/roadmaps", "/me/likes"]){
    try {
      const { data } = await api.get(path);
      const arr =
        Array.isArray(data) ? data :
        Array.isArray(data?.roadmaps) ? data.roadmaps :
        Array.isArray(data?.likedRoadmapIds) ? data.likedRoadmapIds :
        [];
      return new Set(arr.map((x) => Number(x)));
    } catch {}
  }
  return new Set();
}

export async function likeRoadmap(roadmapId) {
  if (!hasToken()) throw new Error("No session");
  return api.post(`/me/likes/roadmap/${encodeURIComponent(String(roadmapId))}`);
}

export async function unlikeRoadmap(roadmapId) {
  if (!hasToken()) throw new Error("No session");
  return api.delete(`/me/likes/roadmap/${encodeURIComponent(String(roadmapId))}`);
}
