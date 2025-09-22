// backend/routes/LikesRoute.js
import { Router } from "express";
import verifyToken from "../middleware/verifytoken.js";
import sequelize from "../config/database.js";

import Tag from "../models/Tag.js";
import Roadmap from "../models/Roadmap.js";

const router = Router();

// Protegemos todo lo que cuelga de este router
router.use(verifyToken);

// ============== Utils ==============
function toPosInt(x) {
  const n = Number(x);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function classifySequelizeError(e) {
  const msg = String(e?.parent?.sqlMessage || e?.message || "");
  if (/duplicate/i.test(msg) || /unique constraint/i.test(msg)) {
    return { status: 409, body: { error: "UNIQUE_CONSTRAINT" } };
  }
  if (/FOREIGN KEY|ER_NO_REFERENCED_ROW|a foreign key constraint fails/i.test(msg)) {
    return { status: 400, body: { error: "FK_CONSTRAINT" } };
  }
  return null;
}

// Detecta modelos (por si difieren de nombre)
const TagLike =
  sequelize.models.UserLikedTag ||
  sequelize.models.user_liked_tags ||
  sequelize.models.UserTagLike ||
  sequelize.models.UserLikedTags;

const RoadmapLike =
  sequelize.models.UserLikedRoadmap ||
  sequelize.models.user_liked_roadmaps ||
  sequelize.models.UserRoadmapLike ||
  sequelize.models.UserLikedRoadmaps;

if (!TagLike) {
  console.warn("[LikesRoute] ⚠ No se encontró el modelo pivot de TAG likes.");
}
if (!RoadmapLike) {
  console.warn("[LikesRoute] ⚠ No se encontró el modelo pivot de ROADMAP likes.");
}

// ============== Resolvers (validan existencia en BD) ==============
async function resolveTagId(ref) {
  const n = toPosInt(ref);
  if (n) {
    const exists = await Tag.count({ where: { id: n } });
    return exists ? n : null;
  }
  const bySlug = await Tag.findOne({ where: { slug: String(ref) } });
  if (bySlug) return Number(bySlug.id);
  const byName = await Tag.findOne({ where: { name: String(ref) } });
  if (byName) return Number(byName.id);
  return null;
}

async function resolveRoadmapId(ref) {
  const n = toPosInt(ref);
  if (n) {
    const exists = await Roadmap.count({ where: { id: n } });
    return exists ? n : null;
  }
  const bySlug = await Roadmap.findOne({ where: { slug: String(ref) } });
  if (bySlug) return Number(bySlug.id);
  const byTitle = await Roadmap.findOne({ where: { title: String(ref) } });
  if (byTitle) return Number(byTitle.id);
  return null;
}

// ============== TAGS ==============

// GET /api/me/likes  o  /api/me/likes/tags -> ids de tags con like
router.get(["/me/likes", "/me/likes/tags"], async (req, res) => {
  try {
    if (!TagLike) return res.json([]);
    const likes = await TagLike.findAll({
      where: { userId: req.user.id },
      attributes: ["tagId"],
      order: [["tagId", "ASC"]],
    });
    return res.json(likes.map((x) => Number(x.tagId)));
  } catch (e) {
    console.error("[GET /me/likes] ", e);
    return res.status(500).json({ error: "likes_tags_failed" });
  }
});

// POST /api/me/likes/tag/:ref -> crea like (ref = id | slug | name)
router.post("/me/likes/tag/:ref", async (req, res) => {
  try {
    if (!TagLike) return res.status(500).json({ error: "TAG_LIKE_MODEL_UNDEFINED" });

    const tagId = await resolveTagId(req.params.ref);
    if (!tagId) return res.status(400).json({ error: "TAG_REF_INVALID" });

    const [row, created] = await TagLike.findOrCreate({
      where: { userId: req.user.id, tagId },
      defaults: { userId: req.user.id, tagId },
    });
    return res.json({ ok: true, created, tagId: Number(row.tagId) });
  } catch (e) {
    const classified = classifySequelizeError(e);
    if (classified) return res.status(classified.status).json(classified.body);
    console.error("[POST /me/likes/tag/:ref] ", e);
    return res.status(500).json({ error: "like_tag_failed" });
  }
});

// DELETE /api/me/likes/tag/:ref -> borra like (ref = id | slug | name)
router.delete("/me/likes/tag/:ref", async (req, res) => {
  try {
    if (!TagLike) return res.status(500).json({ error: "TAG_LIKE_MODEL_UNDEFINED" });

    const tagId = await resolveTagId(req.params.ref);
    if (!tagId) return res.status(400).json({ error: "TAG_REF_INVALID" });

    const del = await TagLike.destroy({ where: { userId: req.user.id, tagId } });
    return res.json({ ok: true, deleted: del > 0, tagId });
  } catch (e) {
    console.error("[DELETE /me/likes/tag/:ref] ", e);
    return res.status(500).json({ error: "unlike_tag_failed" });
  }
});

// ============== ROADMAPS ==============

// GET /api/me/likes/roadmaps -> ids de roadmaps con like
router.get("/me/likes/roadmaps", async (req, res) => {
  try {
    if (!RoadmapLike) return res.json([]);
    const likes = await RoadmapLike.findAll({
      where: { userId: req.user.id },
      attributes: ["roadmapId"],
      order: [["roadmapId", "ASC"]],
    });
    return res.json(likes.map((x) => Number(x.roadmapId)));
  } catch (e) {
    console.error("[GET /me/likes/roadmaps] ", e);
    return res.status(500).json({ error: "likes_roadmaps_failed" });
  }
});

// POST /api/me/likes/roadmap/:ref -> crea like (ref = id | slug | title)
router.post("/me/likes/roadmap/:ref", async (req, res) => {
  try {
    if (!RoadmapLike) return res.status(500).json({ error: "ROADMAP_LIKE_MODEL_UNDEFINED" });

    const roadmapId = await resolveRoadmapId(req.params.ref);
    if (!roadmapId) return res.status(400).json({ error: "ROADMAP_REF_INVALID" });

    const [row, created] = await RoadmapLike.findOrCreate({
      where: { userId: req.user.id, roadmapId },
      defaults: { userId: req.user.id, roadmapId },
    });
    return res.json({ ok: true, created, roadmapId: Number(row.roadmapId) });
  } catch (e) {
    const classified = classifySequelizeError(e);
    if (classified) return res.status(classified.status).json(classified.body);
    console.error("[POST /me/likes/roadmap/:ref] ", e);
    return res.status(500).json({ error: "like_roadmap_failed" });
  }
});

// DELETE /api/me/likes/roadmap/:ref -> borra like (ref = id | slug | title)
router.delete("/me/likes/roadmap/:ref", async (req, res) => {
  try {
    if (!RoadmapLike) return res.status(500).json({ error: "ROADMAP_LIKE_MODEL_UNDEFINED" });

    const roadmapId = await resolveRoadmapId(req.params.ref);
    if (!roadmapId) return res.status(400).json({ error: "ROADMAP_REF_INVALID" });

    const del = await RoadmapLike.destroy({ where: { userId: req.user.id, roadmapId } });
    return res.json({ ok: true, deleted: del > 0, roadmapId });
  } catch (e) {
    console.error("[DELETE /me/likes/roadmap/:ref] ", e);
    return res.status(500).json({ error: "unlike_roadmap_failed" });
  }
});

export default router;
