// src/pages/headerPages/roadmaps.jsx
import React, { useEffect, useState, useContext } from "react";
import "./roadmaps.css";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getLikes, setLikes, toggleRoadmapLike } from "../../utils/userPrefs";
import { getRoadmaps } from "../../services/catalog";
import { getMyLikedRoadmapIds, likeRoadmap, unlikeRoadmap } from "../../services/likes";

// Export vacío por compatibilidad con Home (si aún lo importara)
export const ROADMAPS = [];

export default function Roadmaps() {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  const [roadmaps, setRoadmaps] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [likedSet, setLikedSet] = useState(() => {
    const ls = getLikes(user)?.roadmaps || {};
    return new Set(Object.entries(ls).filter(([, v]) => !!v).map(([k]) => String(k)));
  });

  // 1) Cargar roadmaps reales desde backend
  useEffect(() => {
    (async () => {
      try {
        const list = await getRoadmaps();       // [{id,title,tags:[{id,name}]}]
        setRoadmaps(list);
        if (typeof window !== "undefined") window.__ROADMAPS_CACHE__ = list; // compat opcional
      } catch (e) {
        console.error("No se pudo cargar /catalog/roadmaps:", e);
        setRoadmaps([]);
      }
    })();
  }, []);

  // 2) Sincronizar likes desde backend -> localStorage/UI
  useEffect(() => {
    (async () => {
      if (!isLogged) return;
      try {
        const ids = await getMyLikedRoadmapIds(); // Set<number>
        if (ids.size === 0) return;

        const likes = getLikes(user);
        const next = { ...(likes.roadmaps || {}) };
        ids.forEach((id) => { next[String(id)] = true; });

        setLikes(user, { ...likes, roadmaps: next });
        setLikedSet(new Set(Object.entries(next).filter(([, v]) => !!v).map(([k]) => String(k))));
      } catch (e) {
        console.warn("No se pudieron sincronizar roadmaps liked:", e);
      }
    })();
  }, [isLogged, user]);

  const isLiked = (rid) => likedSet.has(String(rid));
  const toggleExpand = (rid) => setExpanded((prev) => ({ ...prev, [rid]: !prev[rid] }));

  // 3) Toggle con UI optimista + persistencia real
  const toggleLike = async (rid) => {
    const idNum = Number(rid);
    const idStr = String(rid);

    // Por seguridad: no intentes persistir si el id no es entero positivo
    if (!Number.isInteger(idNum) || idNum <= 0) {
      console.warn("Roadmap con id inválido (no se puede persistir):", rid);
      setLikedSet((prev) => {
        const next = new Set(prev);
        if (next.has(idStr)) next.delete(idStr); else next.add(idStr);
        return next;
      });
      return;
    }

    if (!isLogged) {
      setLikedSet((prev) => {
        const next = new Set(prev);
        if (next.has(idStr)) next.delete(idStr); else next.add(idStr);
        return next;
      });
      return;
    }

    try {
      // UI/localStorage optimista
      const likes = toggleRoadmapLike(user, idStr);
      const nowLiked = !!likes.roadmaps?.[idStr];
      setLikedSet(new Set(Object.entries(likes.roadmaps || {}).filter(([, v]) => !!v).map(([k]) => String(k))));

      // Persistencia real en BD
      if (nowLiked) await likeRoadmap(idNum);
      else await unlikeRoadmap(idNum);
    } catch (e) {
      console.error("Backend roadmap-like error (UI intacta):", e);
    }
  };

  return (
    <section className="roadmaps-section">
      <h2>ROADMAPS</h2>

      {roadmaps.length === 0 ? (
        <p className="muted">Cargando roadmaps…</p>
      ) : (
        roadmaps.map((rm) => {
          const liked = isLiked(rm.id);
          const likeDisabled = !Number.isInteger(Number(rm.id)) || Number(rm.id) <= 0;

          return (
            <div key={rm.id} className="roadmap-item">
              <div className="roadmap-header">
                <button className="roadmap-pill" onClick={() => toggleExpand(rm.id)}>
                  {rm.title}
                </button>
                <button
                  className={`like-btn ${liked ? "liked" : ""}`}
                  onClick={() => !likeDisabled && toggleLike(rm.id)}
                  aria-pressed={liked}
                  aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
                  title={likeDisabled ? "No disponible (id inválido)" : liked ? "Quitar me gusta" : "Dar me gusta"}
                  disabled={likeDisabled}
                >
                  {liked ? "♥" : "♡"}
                </button>
              </div>

              {expanded[rm.id] && (
                <div className="roadmap-tags-container">
                  {(rm.tags || []).map((t) => (
                    <span key={t.id || t.slug || t.name} className="roadmap-tag">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
      <p className="note">* Aquí solo ves los tags de cada roadmap. Para ver videos, vuelve al Home.</p>
    </section>
  );
}
