// src/pages/headerPages/home.jsx
import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import "./home.mod.css";

import TagsContainer from "../../components/TagsContainer";
import VideosContainer from "../../components/VideosContainer";
import { AuthContext } from "../../components/AuthContext.jsx";

import { getLikes } from "../../utils/userPrefs";
import { getTags, getRoadmaps } from "../../services/catalog";
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
      {/* === HERO para visitantes (no logueados) === */}
      {!isLogged && (
        <section className="guest-hero">
          <div className="guest-hero-grid">
            <div className="hero-copy">
              <h1>Haz un diagnóstico de tu negocio y verifica su rentabilidad en minutos</h1>

              {/* Subtítulo: NO tocar */}
              <p className="hero-sub">
                Explora <strong>TAGS</strong> pensados para búsquedas reales en YouTube
                y sigue <strong>ROADMAPS</strong> ordenados para avanzar paso a paso.
              </p>

              <ul className="hero-steps">
                <li>
                  Entra a <strong>Mi Negocio</strong> y completa el formulario
                </li>
                <li>
                  Usa datos simples (ventas, costos, gastos) — unas sumas y listo
                </li>
                <li>
                  Obtén tu <strong>Semáforo PyME</strong> y recomendaciones accionables
                </li>
              </ul>

              <div className="hero-cta">
                <a href="#explorar" className="btn btn-primary">Explorar TAGS</a>
                <a href="/login" className="btn btn-ghost">Crear cuenta</a>
              </div>
            </div>

            <aside className="hero-aside">
              <div className="aside-card">
                <h4 className="aside-title">¿Qué te ayuda a detectar?</h4>
                <ul className="aside-list">
                  <li>Si hoy tu negocio es rentable</li>
                  <li>Tu punto de equilibrio (breakeven)</li>
                  <li>Fugas de caja y gastos"fantasma"</li>
                  <li>Márgenes débiles o precios mal calibrados</li>
                </ul>
              </div>
              <div className="aside-card">
                <h4 className="aside-title">¿Que vas a conocer?</h4>
                <ul className="aside-list">
                  <li>Flujo de caja estimado y su tendencia</li>
                  <li>Estructura de costos y gastos</li>
                  <li>Dependencia del negocio a las ventas actuales</li>
                  <li>Tu <strong>Semáforo PyME</strong> con acciones sugeridas</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Text cards (sin textarea) */}
      {!isLogged && (
        <div className="text-containers-wrapper">
          <div className="text-container">
            <header className="tc-header">
              <div className="tc-icon" aria-hidden>🎓</div>
              <h3 className="tc-title tc-title-accent">
                Aprende con <span className="tc-badge">TAGS</span>
              </h3>
            </header>

            <div className="tc-body">
              <p className="tc-lead">
                Amplía tu conocimiento con TAGS y ROADMAPS especializados para una búsqueda inteligente.
              </p>
              <ul className="tc-bullets">
                <li>Encuentra contenido útil en YouTube sin perderte en el ruido.</li>
                <li>Sigue rutas paso a paso: de cero a “lo aplico hoy”.</li>
                <li>Presupuesto, deudas, inversión básica y más.</li>
              </ul>
            </div>
          </div>

          <div className="text-container">
            <header className="tc-header">
              <div className="tc-icon" aria-hidden>⭐</div>
              <h3 className="tc-title tc-title-accent">
                Guarda y recibe <span className="tc-badge">recomendaciones</span>
              </h3>
            </header>

            <div className="tc-body">
              <p className="tc-lead">
                Al registrarte, podrás guardar tus TAGS y ROADMAPS favoritos y habilitar el módulo <strong>“Mi Negocio”</strong> para tu Semáforo PyME.
              </p>
              <ul className="tc-bullets">
                <li>Recomendaciones personalizadas según tus intereses.</li>
                <li>Acceso rápido a lo que estás aprendiendo.</li>
                <li>Decisiones claras con datos simples.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sección principal: Tags (izq) + Videos (der) */}
      {isLogged && (
        <section className="user-intro">
          <h2 className="user-intro__title">Empieza a aprender hoy</h2>
          <p className="user-intro__subtitle">
            Explora <strong>TAGS</strong> para profundizar en temas específicos de educación financiera,
            o sigue <strong>ROADMAPS</strong> para avanzar paso a paso en un tema. 
            Además, usa el botón <strong>“Mi Negocio”</strong> en el menú para realizar el diagnóstico
            de tu negocio y validar su rentabilidad.
          </p>
          <div className="user-intro__cta">
            <a href="#explorar" className="btn btn-primary">Buscar TAGS</a>
            <a href="/roadmaps" className="btn btn-ghost">Ver ROADMAPS</a>
            {/* Nota: "Mi Negocio" vive en el header, por eso no enlazamos aquí una ruta desconocida */}
          </div>
        </section>
      )}
      <div className="main-content-area" id="explorar">
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
        <p className="title-shadow">Convierte tus números en acciones concretas</p> 
        <p className="title-shadow">Detecta riesgos antes de que afecten tu caja</p>
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
