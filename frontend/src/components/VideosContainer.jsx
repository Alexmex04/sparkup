import React, { useEffect, useRef, useState } from "react";
import "./VideosContainer.css";

const BATCH_SIZE = 5;

async function fetchYouTubeBatch(tag, pageToken = "") {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Falta VITE_YOUTUBE_API_KEY en .env");

  const params = new URLSearchParams({
    part: "snippet",
    q: tag,
    key: apiKey,
    maxResults: String(BATCH_SIZE),
    type: "video",
    relevanceLanguage: "es",
    regionCode: "MX",
    safeSearch: "moderate",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!res.ok) {
    let reason = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      console.error("YouTube API error payload:", j);
      reason = j?.error?.errors?.[0]?.reason || j?.error?.message || reason;
    } catch {}
    throw new Error(reason);
  }
  const data = await res.json();
  const items = (data.items || []).map((it) => ({
    id: it?.id?.videoId,
    title: it?.snippet?.title,
    channelName: it?.snippet?.channelTitle,
  }));
  return { items, nextPageToken: data.nextPageToken || null };
}

export default function VideosContainer({ selectedTag }) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false); // whether next page exists
  const sentinelRef = useRef(null);

  // Refs to avoid duplicate fetches due to re-renders
  const tagRef = useRef("");
  const nextTokenRef = useRef(null);
  const inflightRef = useRef(false);
  const videosLenRef = useRef(0);

  // Reset when tag changes
  useEffect(() => {
    tagRef.current = selectedTag || "";
    nextTokenRef.current = null;
    videosLenRef.current = 0;
    setVideos([]);
    setHasMore(false);
    setError("");
  }, [selectedTag]);

  async function loadMore() {
    if (!tagRef.current || inflightRef.current) return;
    inflightRef.current = true;
    try {
      const { items, nextPageToken } = await fetchYouTubeBatch(
        tagRef.current,
        nextTokenRef.current || ""
      );
      // Append strictly 5 at a time (API already limited to 5)
      setVideos((prev) => {
        const merged = [...prev, ...items];
        videosLenRef.current = merged.length;
        return merged;
      });
      nextTokenRef.current = nextPageToken;
      setHasMore(!!nextPageToken);
    } catch (e) {
      console.error("Error YouTube:", e);
      setError(String(e.message || e));
    } finally {
      inflightRef.current = false;
    }
  }

  // Initial load only once per selectedTag
  useEffect(() => {
    if (tagRef.current) loadMore(); // one batch (5)
    // do NOT include loadMore in deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Only fetch next page when we already rendered at least one batch
        if (entry.isIntersecting && hasMore && videosLenRef.current > 0 && !inflightRef.current) {
          loadMore();
        }
      },
      { root: null, rootMargin: "200px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore]); // observing status changes only when hasMore flips

  return (
    <div className="videos-main-container">
      {!tagRef.current ? (
        <p className="initial-message">Selecciona un tag para ver los videos</p>
      ) : (
        <>
          {videos.map((v) => (
            <div key={v.id} className="video-card">
              <h3>{v.title}</h3>
              <p className="channel-name">{v.channelName}</p>
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}

          {/* Sentinel for lazy loading */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {inflightRef.current && <p className="loading">Cargando…</p>}
          {error && <p className="error">Error al cargar videos: {error}</p>}
          {!hasMore && videos.length > 0 && <p className="muted small">No hay más resultados.</p>}
        </>
      )}
    </div>
  );
}
