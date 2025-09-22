// backend/routes/RecommendationsRoute.js
import { Router } from "express";
import { ensureAuth } from "../middleware/auth.js";
import { UserLikedTag, Roadmap, Tag } from "../models/index.js";

const router = Router();
router.use(ensureAuth);

router.get("/me/recommendations/roadmaps", async (req, res) => {
  const userId = req.user.id;
  const likedTagRows = await UserLikedTag.findAll({ where: { userId } });
  const likedTagIds = new Set(likedTagRows.map(r => r.tagId));

  const roadmaps = await Roadmap.findAll({
    include: [{ model: Tag, through: { attributes: [] } }],
  });

  const out = roadmaps.map(rm => {
    const total = rm.Tags.length || 1;
    const liked = rm.Tags.filter(t => likedTagIds.has(t.id)).length;
    const ratio = liked / total;
    return { id: rm.id, title: rm.title, percent: Math.round(ratio * 100), liked, total };
  }).filter(x => x.percent >= 40)
    .sort((a,b) => b.percent - a.percent);

  res.json(out);
});

export default router;
