import React, { useEffect, useState, useContext } from "react";
import "./roadmaps.css";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getLikes, setLikes, toggleRoadmapLike } from "../../utils/userPrefs";
import { getRoadmaps } from "../../services/catalog";
import useLiveLikes from "../../hooks/useLiveLikes";

// Export vacío por compatibilidad con Home (si aún lo importara)
export const ROADMAPS = [];

export default function Roadmaps() {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  const [roadmaps, setRoadmaps] = useState([]);
  const [expanded, setExpanded] = useState({});

  // NUEVO: hook de likes en vivo (ids reales del backend)
  const {
    likedRoadmaps,                    // Set<number>
    likeRoadmap, unlikeRoadmap,       // helpers REST + recarga
    loading: likesLoading
  } = useLiveLikes();

  // Para invitados (no logueados), mantenemos un set local para UX
  const [guestLiked, setGuestLiked] = useState(new Set());

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

  // 2) Sincronizar likes desde backend -> localStorage (solo si hay user)
  useEffect(() => {
    (async () => {
      if (!isLogged) return;
      try {
        if (likedRoadmaps.size === 0) return;

        const likes = getLikes(user);
        const next = { ...(likes.roadmaps || {}) };
        likedRoadmaps.forEach((id) => { next[String(id)] = true; });

        setLikes(user, { ...likes, roadmaps: next });
      } catch (e) {
        console.warn("No se pudieron sincronizar roadmaps liked:", e);
      }
    })();
  }, [isLogged, user, likedRoadmaps]);

  const isLiked = (rid) => {
    const idNum = Number(rid);
    return likedRoadmaps.has(idNum) || guestLiked.has(String(rid));
  };

  const toggleExpand = (rid) => setExpanded((prev) => ({ ...prev, [rid]: !prev[rid] }));

  // 3) Toggle con UI optimista; en logueados persiste en servidor
  const toggleLike = async (rid) => {
    const idNum = Number(rid);
    const idStr = String(rid);

    // Por seguridad: no intentes persistir si el id no es entero positivo
    if (!Number.isInteger(idNum) || idNum <= 0) {
      console.warn("Roadmap con id inválido (no se puede persistir):", rid);
      setGuestLiked((prev) => {
        const next = new Set(prev);
        if (next.has(idStr)) next.delete(idStr); else next.add(idStr);
        return next;
      });
      return;
    }

    if (!isLogged) {
      // UX local para invitados
      setGuestLiked((prev) => {
        const next = new Set(prev);
        if (next.has(idStr)) next.delete(idStr); else next.add(idStr);
        return next;
      });
      return;
    }

    try {
      // UI/localStorage optimista (opcional)
      const likes = toggleRoadmapLike(user, idStr);
      // Persistencia real en BD + recarga automática con el hook
      if (!!likes.roadmaps?.[idStr]) await likeRoadmap(idNum);
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
