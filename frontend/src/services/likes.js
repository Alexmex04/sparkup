//likes.js
import api from "../utils/api";

// Obtiene IDs de tags likeados desde el backend
export async function getMyLikedTagIds() {
  for (const path of ["/me/likes", "/me/likes/tags"]){
    try{
      const { data } = await api.get(path);
      const arr=
         Array.isArray(data) ? data :
         Array.isArray(data?.tags) ? data.tags :
         Array.isArray(data?.likedTagIds) ? data.likedTagIds :
         [];
      return new Set(arr.map((x) => Number(x)));  
    }catch{}
  }
  return new Set();
}

export async function likeTag(ref) {
  return api.post(`/me/likes/tag/${encodeURIComponent(String(ref))}`);
}



export async function unlikeTag(ref) {
  return api.delete(`/me/likes/tag/${encodeURIComponent(String(ref))}`);
}

//ROADMAPS SECTION
export async function getMyLikedRoadmapIds() {
  try {
    const { data } = await api.get("/me/likes/roadmaps");
    const arr =
      Array.isArray(data) ? data :
      Array.isArray(data?.roadmaps) ? data.roadmaps :
      [];
    return new Set(arr.map((x) => Number(x)));
  } catch {
    return new Set();
  }
}

export async function likeRoadmap(roadmapId) {
  return api.post(`/me/likes/roadmap/${encodeURIComponent(String(roadmapId))}`);
}

export async function unlikeRoadmap(roadmapId) {
  return api.delete(`/me/likes/roadmap/${encodeURIComponent(String(roadmapId))}`);
}
