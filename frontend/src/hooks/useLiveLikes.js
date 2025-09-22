import { useEffect, useState, useCallback } from "react";
import { socket } from "../utils/socket";
import {
  getMyLikedTagIds,
  getMyLikedRoadmapIds,
  likeTag, unlikeTag,
  likeRoadmap, unlikeRoadmap
} from "../services/likes";

/**
 * Hook que:
 * - carga likes (tags y roadmaps) desde tu API
 * - escucha el evento "likes:updated" por socket y recarga
 * - expone helpers para like/unlike que recargan al terminar
 */
export default function useLiveLikes({ autoLoad = true } = {}) {
  const [likedTags, setLikedTags] = useState(() => new Set());
  const [likedRoadmaps, setLikedRoadmaps] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, r] = await Promise.all([getMyLikedTagIds(), getMyLikedRoadmapIds()]);
      setLikedTags(t); setLikedRoadmaps(r);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (autoLoad) load(); }, [autoLoad, load]);

  useEffect(() => {
    const onLikes = () => load();
    socket.on("likes:updated", onLikes);
    return () => socket.off("likes:updated", onLikes);
  }, [load]);

  const likeTagAction = async (ref) => { await likeTag(ref); await load(); };
  const unlikeTagAction = async (ref) => { await unlikeTag(ref); await load(); };
  const likeRoadmapAction = async (id) => { await likeRoadmap(id); await load(); };
  const unlikeRoadmapAction = async (id) => { await unlikeRoadmap(id); await load(); };

  return {
    likedTags, likedRoadmaps, loading,
    reloadLikes: load,
    likeTag: likeTagAction,
    unlikeTag: unlikeTagAction,
    likeRoadmap: likeRoadmapAction,
    unlikeRoadmap: unlikeRoadmapAction,
  };
}
