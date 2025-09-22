// frontend/src/pages/headerPages/home.jsx
import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import "./home.mod.css";

import TagsContainer from "../../components/TagsContainer";
import VideosContainer from "../../components/VideosContainer";
import { AuthContext } from "../../components/AuthContext.jsx";

import { getLikes, setLikes, toggleTagLike } from "../../utils/userPrefs";
import { getTags, getRoadmaps } from "../../services/catalog";
import { likeTag, unlikeTag, getMyLikedTagIds } from "../../services/likes";

function Home() {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  // ====== TAGS ======
  const [tagsList, setTagsList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [likedTags, setLikedTags] = useState(() =>
    isLogged ? (getLikes(user).tags || {}) : {}
  );

  // Mapas auxiliares para resolver id/slug/name <-> name
  const nameToIdRef = useRef(new Map());
  const idToNameRef = useRef(new Map());
  const slugToIdRef = useRef(new Map());

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

  // Sincroniza likes de tags desde backend al entrar logueado (no cambia tu guardado)
  useEffect(() => {
    (async () => {
      if (!isLogged) return;
      try {
        const ids = await getMyLikedTagIds(); // Set<number>
        if (ids.size === 0) return;

        const likes = getLikes(user);
        const next = { ...(likes.tags || {}) };
        ids.forEach((id) => {
          const name = idToNameRef.current.get(Number(id));
          if (name) next[name] = true;
        });
        setLikes(user, { ...likes, tags: next });
        setLikedTags({ ...next });
      } catch (e) {
        console.warn("No se pudieron sincronizar tags liked:", e);
      }
    })();
  }, [isLogged, user]);

  const handleTagSelect = (tagObj) => {
    const name =
      tagObj && typeof tagObj === "object"
        ? tagObj.name ?? String(tagObj.id)
        : String(tagObj);
    setSelectedTag(name);
  };

  const handleLikeToggle = async (tagObj) => {
    const ref =
      (tagObj &&
        typeof tagObj === "object" &&
        (tagObj.id ?? tagObj.slug ?? tagObj.name)) ||
      tagObj;

    const name =
      (tagObj &&
        typeof tagObj === "object" &&
        (tagObj.name ??
          idToNameRef.current.get(Number(tagObj.id)) ??
          tagObj.slug)) ||
      String(ref);

    if (isLogged) {
      const likes = toggleTagLike(user, name); // UI inmediata + localStorage
      setLikedTags({ ...(likes.tags || {}) });
      try {
        if (likedTags[name]) {
          await unlikeTag(ref);
        } else {
          await likeTag(ref);
        }
      } catch (e) {
        console.error("Backend like tag error (UI intacta):", e);
      }
    } else {
      // Visitante: solo memoria (no persistimos)
      setLikedTags((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  // ====== ROADMAPS (para Home del usuario logueado) ======
  const likesAll = useMemo(() => getLikes(user), [user]);
  const likedRoadmapIds = useMemo(
    () =>
      likesAll?.roadmaps
        ? Object.entries(likesAll.roadmaps)
            .filter(([, v]) => !!v)
            .map(([k]) => Number(k))
        : [],
    [likesAll]
  );

  // Cargar roadmaps reales solo si hay likes
  const [roadmapsById, setRoadmapsById] = useState(new Map());
  useEffect(() => {
    (async () => {
      if (!isLogged || likedRoadmapIds.length === 0) return;
      try {
        const rms = await getRoadmaps(); // [{id,title,slug,tags:[{id,name,slug}]}]
        setRoadmapsById(new Map(rms.map((r) => [Number(r.id), r])));
      } catch (e) {
        console.error("No se pudo cargar /catalog/roadmaps en Home:", e);
        setRoadmapsById(new Map());
      }
    })();
  }, [isLogged, likedRoadmapIds.length]);

  // Tag seleccionado por cada roadmap (para ver videos)
  const [selectedByRoadmap, setSelectedByRoadmap] = useState({});
  const pickRoadmapTag = (rid, tagObjOrName) => {
    const tagName =
      tagObjOrName && typeof tagObjOrName === "object"
        ? tagObjOrName.name ?? String(tagObjOrName.id)
        : String(tagObjOrName);
    setSelectedByRoadmap((prev) => ({ ...prev, [rid]: tagName }));
  };

  // Mostrar todos los tags si no hay sesión o si el usuario logueado aún no tiene likes
  const showOnlyLiked = isLogged && Object.keys(likedTags || {}).length > 0;

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
          likedTags={likedTags}
          onLikeToggle={handleLikeToggle}
          // antes: showOnlyLiked={isLogged}
          showOnlyLiked={showOnlyLiked}
        />
        <VideosContainer selectedTag={selectedTag} />
      </div>

      {/* ROADMAPS likeados: solo logueado */}
      {isLogged && (
        <section className="roadmaps-section">
          <h2>ROADMAPS</h2>

          {likedRoadmapIds.length === 0 ? (
            <p className="muted">
              Dale “me gusta” a uno en la sección Roadmaps para verlo aquí.
            </p>
          ) : (
            likedRoadmapIds.map((rid) => {
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
