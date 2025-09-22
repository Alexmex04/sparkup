import api from "../utils/api";

// Normaliza respuesta del backend a: [{ id, name }]
export async function getTags() {
  const { data } = await api.get("/catalog/tags");
  const raw = Array.isArray(data) ? data : (Array.isArray(data?.tags) ? data.tags : []);
  return raw.map((t, i) => {
    if (typeof t === "string"){
      const name = t;
      const slug = name
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
       .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      return { id: i + 1, name, slug };
    }
    const id   = t?.id ?? t?.tag_id ?? (i + 1);
    const name = t?.name ?? t?.tag_name ?? `tag_${i+1}`;
    const slug = t?.slug ?? (name
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    return { id, name, slug };
    if (t?.id && t?.name) return t;                                   // forma esperada
    // otros posibles campos:
    return { id: t?.tag_id ?? t?.id ?? i + 1, name: t?.tag_name ?? t?.name ?? `tag_${i+1}` };
  });
}

export async function getRoadmaps() {
  const { data } = await api.get("/catalog/roadmaps");
  const raw = Array.isArray(data) ? data : (Array.isArray(data?.roadmaps) ? data.roadmaps : []);
  return raw.map((r, i) => ({
    id: Number(r?.id ?? i + 1),                          
    title: r?.title ?? r?.name ?? `roadmap_${i+1}`,
    slug: r?.slug ?? null,
    position: r?.position ?? i,
    tags: Array.isArray(r?.tags)
      ? r.tags.map((t, j) => ({
          id: Number(t?.id ?? j + 1),
          name: t?.name ?? `tag_${j+1}`,
          slug: t?.slug ?? null,
          position: t?.position ?? j,
        }))
      : [],
  }));
}

