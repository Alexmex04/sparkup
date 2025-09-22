// backend/routes/CatalogRoute.js
import { Router } from "express";

const router = Router();

function slugify(str = "") {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function tryLoadFromDB() {
  let models;
  try {
    const mod = await import("../models/index.js");
    models = mod?.default || mod;
  } catch {
    return null;
  }

  const Tag        = models.Tag;
  const Roadmap    = models.Roadmap;
  const RoadmapTag = models.RoadmapTag;
  if (!Tag && !Roadmap) return null;

  // ===== TAGS =====
  const tags = [];
  try {
    if (Tag?.findAll) {
      const rows = await Tag.findAll({ order: [["name", "ASC"]] });
      for (const row of rows) {
        const id   = row.id ?? row.dataValues?.id;
        const name = row.name ?? row.dataValues?.name;
        const slug = row.slug || slugify(name);
        tags.push({ id, name, slug });
      }
    }
  } catch {}

  // ===== ROADMAPS ===== (tu tabla: id, title, slug, createdAt, updatedAt)
  const roadmaps = [];
  try {
    if (Roadmap?.findAll) {
      const baseOrder = [["title", "ASC"]];

      const hasAssocTags = !!(Roadmap.associations && Roadmap.associations.tags);
      const include = hasAssocTags && Tag
        ? [{ model: Tag, as: "tags", through: { attributes: [] } }]
        : [];

      let rows;
      try {
        rows = await Roadmap.findAll({ include, order: baseOrder });
      } catch {
        rows = await Roadmap.findAll({ order: baseOrder });
      }

      for (const r of rows) {
        const id    = r.id ?? r.dataValues?.id;
        const title = r.title ?? r.dataValues?.title;
        const slug  = r.slug || slugify(title);
        let rmtags  = [];

        if (Array.isArray(r.tags)) {
          rmtags = r.tags.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug || slugify(t.name),
            position: t.position || 0
          }));
        } else if (RoadmapTag && Tag) {
          try {
            const links = await RoadmapTag.findAll({ where: { roadmapId: id } });
            const tagIds = links.map(l => l.tagId);
            if (tagIds.length) {
              const all = await Tag.findAll({ where: { id: tagIds } });
              rmtags = all.map(t => ({
                id: t.id,
                name: t.name,
                slug: t.slug || slugify(t.name),
                position: 0
              }));
            }
          } catch {}
        }

        roadmaps.push({ id, title, slug, position: 0, tags: rmtags });
      }
    }
  } catch {}

  return {
    tags: tags.length ? tags : null,
    roadmaps: roadmaps.length ? roadmaps : null,
  };
}

router.get("/tags", async (_req, res) => {
  try {
    const db = await tryLoadFromDB();
    if (db?.tags && db.tags.length) return res.json(db.tags);
    return res.json([]);
  } catch (e) {
    console.error("[GET /catalog/tags] ", e);
    return res.status(500).json({ error: "catalog_tags_failed" });
  }
});

router.get("/roadmaps", async (_req, res) => {
  try {
    const db = await tryLoadFromDB();
    if (db?.roadmaps && db.roadmaps.length) return res.json(db.roadmaps);
    return res.json([]); // ← sin 100/101/102
  } catch (e) {
    console.error("[GET /catalog/roadmaps] ", e);
    return res.status(500).json({ error: "catalog_roadmaps_failed" });
  }
});

export default router;
