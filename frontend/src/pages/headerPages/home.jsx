import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import "./home.mod.css";

import TagsContainer from "../../components/TagsContainer";
import VideosContainer from "../../components/VideosContainer";
import { AuthContext } from "../../components/AuthContext.jsx";

import { getLikes } from "../../utils/userPrefs";
import { getTags, getRoadmaps } from "../../services/catalog";

// 🔌 Hook de tiempo real (WS) para likes (tags y roadmaps)
import useLiveLikes from "../../hooks/useLiveLikes";

function Home() {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  // ====== TAGS ======
  const [tagsList, setTagsList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  // Invitados: record por nombre para UI local (no persistente)
  const [guestLikedTags, setGuestLikedTags] = useState({});

  // Mapas auxiliares para resolver id/slug/name <-> name
  const nameToIdRef = useRef(new Map());
  const idToNameRef = useRef(new Map());
  const slugToIdRef = useRef(new Map());

  // Likes en vivo (WS): Set<number> para tags y roadmaps + helpers REST
  const {
    likedTags: likedTagIds,               // Set<number>
    likedRoadmaps,                        // Set<number>
    likeTag, unlikeTag,                   // (refrescan solos tras REST)
    likeRoadmap, unlikeRoadmap,           // (por si los usas aquí después)
    loading: likesLoading
  } = useLiveLikes();

  useEffect(() => {
    (async () => {
      try {
        const list = await getTags(); // [{id,name,slug}]
        const norm = Array.isArray(list)
          ? list.map((t) => ({
              id: Number(t.id),
              name: t.name,
              slug: t.slug,
            }))
          : [];
        setTagsList(norm);

        const n2i = new Map();
        const i2n = new Map();
        const s2i = new Map();
        norm.forEach((t) => {
          n2i.set(t.name, t.id);
          i2n.set(t.id, t.name);
          if (t.slug) s2i.set(t.slug, t.id);
        });
        nameToIdRef.current = n2i;
        idToNameRef.current = i2n;
        slugToIdRef.current = s2i;
      } catch (e) {
        console.error("No se pudo cargar /catalog/tags:", e);
        setTagsList([]);
      }
    })();
  }, []);

  const handleTagSelect = (tagObj) => {
    const name =
      tagObj && typeof tagObj === "object"
        ? tagObj.name ?? String(tagObj.id)
        : String(tagObj);
    setSelectedTag(name);
  };

  // Record por nombre que espera <TagsContainer />, calculado desde Set de IDs (hook)
  const likedTagsByName = useMemo(() => {
    const rec = {};
    for (const t of tagsList) {
      const liked = likedTagIds?.has(Number(t.id)) || false;
      rec[t.name] = liked;
    }
    // Para invitados, mezcla su estado local (solo lectura visual)
    if (!isLogged) {
      for (const [name, val] of Object.entries(guestLikedTags)) {
        rec[name] = !!val;
      }
    }
    return rec;
  }, [tagsList, likedTagIds, isLogged, guestLikedTags]);

  const handleLikeToggle = async (tagObj) => {
    const tagId = Number(tagObj?.id ?? nameToIdRef.current.get(tagObj?.name) ?? 0);
    const tagName = tagObj?.name ?? idToNameRef.current.get(tagId) ?? String(tagId || "");

    if (!isLogged) {
      // Visitante: solo memoria (no persistimos)
      setGuestLikedTags((prev) => ({ ...prev, [tagName]: !prev[tagName] }));
      return;
    }

    // Usuario logueado → persistencia real en backend (y el hook recarga)
    const isLiked = likedTagIds?.has(tagId);
    try {
      if (isLiked) await unlikeTag(tagId || tagObj?.slug || tagName);
      else await likeTag(tagId || tagObj?.slug || tagName);
    } catch (e) {
      console.error("Backend like tag error (UI intacta):", e);
    }
  };

  // ====== ROADMAPS (para Home del usuario logueado) ======
  // Fallback a localStorage SOLO si no hay hook (o usuario no logueado)
  const likesAll = useMemo(() => getLikes(user), [user]);

  const likedRoadmapIdsArray = useMemo(() => {
    if (isLogged && likedRoadmaps && likedRoadmaps.size > 0) {
      return Array.from(likedRoadmaps);
    }
    // Fallback: localStorage (por compatibilidad con tu UX previa)
    const arr = likesAll?.roadmaps
      ? Object.entries(likesAll.roadmaps)
          .filter(([, v]) => !!v)
          .map(([k]) => Number(k))
      : [];
    return arr;
  }, [isLogged, likedRoadmaps, likesAll]);

  // Cargar roadmaps reales solo si hay likes
  const [roadmapsById, setRoadmapsById] = useState(new Map());
  useEffect(() => {
    (async () => {
      if (!isLogged || likedRoadmapIdsArray.length === 0) return;
      try {
        const rms = await getRoadmaps(); // [{id,title,slug,tags:[{id,name,slug}]}]
        setRoadmapsById(new Map(rms.map((r) => [Number(r.id), r])));
      } catch (e) {
        console.error("No se pudo cargar /catalog/roadmaps en Home:", e);
        setRoadmapsById(new Map());
      }
    })();
  }, [isLogged, likedRoadmapIdsArray.length]);

  // Tag seleccionado por cada roadmap (para ver videos)
  const [selectedByRoadmap, setSelectedByRoadmap] = useState({});
  const pickRoadmapTag = (rid, tagObjOrName) => {
    const tagName =
      tagObjOrName && typeof tagObjOrName === "object"
        ? tagObjOrName.name ?? String(tagObjOrName.id)
        : String(tagObjOrName);
    setSelectedByRoadmap((prev) => ({ ...prev, [rid]: tagName }));
  };

  // Mostrar solo liked si hay señal suficiente
  const likedCount = useMemo(
    () => Object.values(likedTagsByName).filter(Boolean).length,
    [likedTagsByName]
  );
  const showOnlyLiked = isLogged && likedCount > 0;

  return (
    <div className="home">
      {/* Texto para visitantes */}
      {!isLogged && (
        <div className="text-containers-wrapper">
          <div className="text-container">
            <textarea
              readOnly
              defaultValue={`Amplía tu conocimiento en finanzas personales e inversiones. 
Haz click en los TAGS que tenemos para ti y adéntrate a los videos que mejor te ayuden en tu camino de aprendizaje.
¡Haz click en Log-In y regístrate ahora!`}
            />
          </div>
          <div className="text-container">
            <textarea
              readOnly
              defaultValue={`Al registrarte, podrás guardar tus TAGS y ROADMAPS favoritos y, además, habilitarás el módulo "Mi Negocio" para tu Semáforo PyME.`}
            />
          </div>
        </div>
      )}

      {/* Sección principal: Tags (izq) + Videos (der) */}
      <div className="main-content-area">
        <TagsContainer
          tags={tagsList}
          onTagSelect={handleTagSelect}
          likedTags={likedTagsByName}
          onLikeToggle={handleLikeToggle}
          showOnlyLiked={showOnlyLiked}
        />
        <VideosContainer selectedTag={selectedTag} />
      </div>

      {/* ROADMAPS likeados: solo logueado */}
      {isLogged && (
        <section className="roadmaps-section">
          <h2>ROADMAPS</h2>

          {likedRoadmapIdsArray.length === 0 ? (
            <p className="muted">
              Dale “me gusta” a uno en la sección Roadmaps para verlo aquí.
            </p>
          ) : (
            likedRoadmapIdsArray.map((rid) => {
              const roadmap = roadmapsById.get(Number(rid));
              if (!roadmap) return null; // aún cargando

              return (
                <div key={roadmap.id} className="roadmap-block">
                  <div className="roadmap-block-title">{roadmap.title}</div>
                  <div className="roadmap-block-grid">
                    <div className="roadmap-tags-only">
                      {(roadmap.tags || []).map((t, idx) => {
                        const key =
                          t?.id ?? t?.slug ?? t?.name ?? `${roadmap.id}-${idx}`;
                        const tagName = t?.name ?? String(t);
                        return (
                          <button
                            key={key}
                            className="roadmap-tag-btn"
                            onClick={() => pickRoadmapTag(roadmap.id, tagName)}
                          >
                            {tagName}
                          </button>
                        );
                      })}
                    </div>
                    <div className="roadmap-videos">
                      {selectedByRoadmap[roadmap.id] ? (
                        <VideosContainer
                          selectedTag={selectedByRoadmap[roadmap.id]}
                        />
                      ) : (
                        <p className="muted small">
                          Selecciona un tag del roadmap para ver videos.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* CTA final */}
      <section className="call-to-action-section">
        <h2>
          Tu <span className="text-green">Semáforo</span>{" "}
          <span className="text-yellow">PyME</span> te ayuda a tomar decisiones{" "}
          <span className="text-red">hoy</span>
        </h2>
        <p>Convierte tus números en acciones concretas</p>
        <p>Detecta riesgos antes de que afecten tu caja</p>
        <div className="cta-register-box">
          <p>
            REGÍSTRATE O SI YA TIENES CUENTA INICIA SESIÓN Y HAZ CLICK EN "MI
            NEGOCIO", RELLENA EL FORMULARIO Y TOMA DECISIONES HOY CON TU
            SEMÁFORO PYME.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
