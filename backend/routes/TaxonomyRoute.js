// backend/routes/TaxonomyRoute.js
import { Router } from "express";
// Opción A: si tu models/index.js exporta Tag/Roadmap:
import { Tag, Roadmap } from "../models/index.js";
// Opción B (si exportas modelos por archivo):
// import Tag from "../models/Tag.js";
// import Roadmap from "../models/Roadmap.js";

const router = Router();

// Todos los tags (catálogo)
router.get("/tags", async (_req, res) => {
  const rows = await Tag.findAll({ order: [["name", "ASC"]] });
  res.json(rows);
});

// Todos los roadmaps con sus tags
router.get("/roadmaps", async (_req, res) => {
  const rows = await Roadmap.findAll({
    include: [{ model: Tag, through: { attributes: [] } }],
    order: [["title", "ASC"]],
  });
  res.json(rows);
});

export default router;
