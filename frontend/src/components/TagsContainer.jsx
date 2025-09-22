// src/components/TagsContainer.jsx
import React, { useState, useMemo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./TagsContainer.css";

/**
 * Props:
 * - tags: Array<{ id:number, name:string, slug?:string }>
 * - likedTags: Record<string, boolean>   // keys por NOMBRE del tag (como ya usas en localStorage)
 * - onTagSelect(tagObj)
 * - onLikeToggle(tagObj)
 * - showOnlyLiked: boolean
 */
export default function TagsContainer({
  tags = [],
  likedTags = {},
  onTagSelect,
  onLikeToggle,
  showOnlyLiked = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Normalizamos: siempre objetos {id, name, slug}
  const normalized = useMemo(
    () =>
      (Array.isArray(tags) ? tags : [])
        .filter(Boolean)
        .map((t, i) =>
          typeof t === "string"
            ? { id: i + 1, name: t, slug: t.toLowerCase().replace(/\s+/g, "-") }
            : {
                id: Number(t.id ?? i + 1),
                name: t.name ?? `tag_${i + 1}`,
                slug:
                  t.slug ??
                  (t.name || "")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-"),
              }
        ),
    [tags]
  );

  const filtered = useMemo(() => {
    const base = normalized.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (showOnlyLiked && !searchTerm) {
      return base.filter((t) => !!likedTags[t.name]);
    }
    return base;
  }, [normalized, searchTerm, showOnlyLiked, likedTags]);

  const handleSelect = (t) => onTagSelect && onTagSelect(t);
  const handleToggle = (t) => onLikeToggle && onLikeToggle(t);

  return (
    <div className="tags-main-container">
      <div className="search-tags-wrapper">
        <input
          type="text"
          placeholder="Buscar tag..."
          className="search-tags-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tags-list">
        {filtered.map((t) => {
          const isLiked = !!likedTags[t.name];
          return (
            <div key={`${t.id}-${t.slug || t.name}`} className="tag-item">
              <button className="tag-button" onClick={() => handleSelect(t)}>
                {t.name}
              </button>
              <span className="like-icon" onClick={() => handleToggle(t)}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="muted">No hay tags para mostrar.</p>
        )}
      </div>
    </div>
  );
}
