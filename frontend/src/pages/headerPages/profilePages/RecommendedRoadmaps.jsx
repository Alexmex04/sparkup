// src/pages/headerPages/profilePages/RecommendedRoadmaps.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./recommended-roadmaps.css";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { getLikes } from "../../../utils/userPrefs";
import { getRoadmaps } from "../../../services/catalog";
import useLiveLikes from "../../../hooks/useLiveLikes";

const LIMIT_DEFAULT = 6;
const MIN_PERCENT = 40; // ← solo recomendar con 40% o más

export default function RecommendedRoadmaps({ limit = LIMIT_DEFAULT }) {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  const [loading, setLoading] = useState(true);
  const [reco, setReco] = useState([]); // [{id,title,slug,tags:[...], score, percent}]

  // Hook de likes (ids reales)
  const { likedTags, likedRoadmaps, loading: likesLoading } = useLiveLikes();

  useEffect(() => {
    (async () => {
      if (!isLogged) {
        setLoading(false);
        setReco([]);
        return;
      }

      try {
        // 1) Tags con like (preferimos IDs del hook)
        let likedTagIds = likedTags; // Set<number>
        let likedTagNames = undefined;

        // Fallback a localStorage si el hook viene vacío
        if (!likedTagIds || likedTagIds.size === 0) {
          const localTags = getLikes(user)?.tags || {};
          likedTagIds = null;
          likedTagNames = new Set(
            Object.entries(localTags)
              .filter(([, v]) => !!v)
              .map(([name]) => String(name))
          );
        }

        // 2) Roadmaps con like (para excluir)
        const likedRoadmapIds = likedRoadmaps || new Set();

        // 3) Catálogo con tags
        const all = await getRoadmaps(); // [{id,title,slug,tags:[{id,name,slug}]}]

        // 4) Score (overlap) y porcentaje
        const scored = all
          .map((r) => {
            const total = Array.isArray(r.tags) ? r.tags.length : 0;
            let overlap = 0;

            if (total > 0) {
              if (likedTagIds && likedTagIds.size > 0) {
                overlap = r.tags.reduce(
                  (acc, t) => (likedTagIds.has(Number(t.id)) ? acc + 1 : acc),
                  0
                );
              } else if (likedTagNames) {
                overlap = r.tags.reduce(
                  (acc, t) =>
                    likedTagNames.has(String(t?.name ?? "")) ? acc + 1 : acc,
                  0
                );
              }
            }

            const percent = total > 0 ? Math.round((overlap / total) * 100) : 0;
            return { ...r, score: overlap, percent, totalTags: total };
          })
          // ← AQUI: umbral mínimo del 40% y excluir los ya liked
          .filter(
            (r) => r.percent >= MIN_PERCENT && !likedRoadmapIds.has(Number(r.id))
          )
          // Orden: mayor porcentaje y luego mayor overlap
          .sort((a, b) => (b.percent - a.percent) || (b.score - a.score))
          .slice(0, limit);

        setReco(scored);
      } catch (e) {
        console.error("RecommendedRoadmaps error:", e);
        setReco([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLogged, user, limit, likedTags, likedRoadmaps]);

  if (!isLogged) {
    return (
      <section className="recommended-roadmaps">
        <h2>Recommended Roadmaps</h2>
        <p className="muted small">
          Inicia sesión y dale like a algunos tags para generar recomendaciones personalizadas.
        </p>
      </section>
    );
  }

  if (loading || likesLoading) {
    return (
      <section className="recommended-roadmaps">
        <h2>Roadmaps</h2>
        <p className="muted small">Cargando recomendaciones…</p>
      </section>
    );
  }

  if (!reco.length) {
    return (
      <section className="recommended-roadmaps">
        <h2>Roadmaps</h2>
        <p className="muted small">
          No encontré roadmaps con al menos {MIN_PERCENT}% de afinidad.
          Prueba dando like a más tags para mejorar las coincidencias.
        </p>
      </section>
    );
  }

  return (
    <section className="recommended-roadmaps">
      <h2>Roadmaps</h2>

      <div className="reco-list">
        {reco.map((roadmap) => (
          <div key={roadmap.id} className="reco-card">
            <div className="reco-header">
              <h3 className="reco-title">{roadmap.title}</h3>
              {/* Badge con porcentaje */}
              <span
                className="reco-badge"
                title={`${roadmap.score}/${roadmap.totalTags} tags en común`}
              >
                {roadmap.percent}%
              </span>
            </div>

            <div className="reco-tags">
              {(roadmap.tags || []).map((t, idx) => {
                const key = t?.id ?? t?.slug ?? t?.name ?? `${roadmap.id}-${idx}`;
                return (
                  <span key={key} className="reco-tag-static">
                    {t?.name ?? String(t)}
                  </span>
                );
              })}
            </div>

            <div className="reco-actions">
              <Link to="/roadmaps" className="nav-link">
                Ver todos los roadmaps
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
