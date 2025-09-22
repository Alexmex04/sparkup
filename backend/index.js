// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // <- Cargar .env ANTES de leer process.env

import { setupAssociations, syncModels } from "./models/index.js";
import { createAdminUser } from "./config/adminSeeder.js";

import CatalogRoute from "./routes/CatalogRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import TaxonomyRoute from "./routes/TaxonomyRoute.js";
import { seedTagsAndRoadmaps,seedRoadmapTagLinks } from "./config/seedTaxonomy.js";
import { Tag } from "./models/index.js";
import LikesRoute from "./routes/LikesRoute.js";

import DiagnosticRoute from "./routes/diagnostic.js";
import predictRoutes from "./routes/predictRoute.js";
import MLDataRoute from "./routes/MLDataRoute.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:3000","http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET","POST","DELETE","PUT","PATCH","OPTIONS"]
}));
app.use(express.json());

// ===== RUTAS PÚBLICAS =====
app.get("/api/health", (req, res) => res.json({ ok: true }));  // health pública
app.use("/api/catalog", CatalogRoute);                          // catálogo PÚBLICO
app.use("/api", AuthRoute); 
app.use(DiagnosticRoute);
app.use(predictRoutes);
app.use(MLDataRoute);
// ===== RUTAS PROTEGIDAS ===== 
// LikesRoute ya se protege adentro con router.use(verifyToken)
app.use("/api", UserRoute);
app.use("/api", LikesRoute);
app.use("/api", TaxonomyRoute); 



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1) Relaciones
    setupAssociations();

    // 2) Sincronizar modelos UNA sola vez
    await syncModels();

    // 3) (Opcional) Seed controlado por env
    if ((await Tag.count()) === 0) {
      await seedTagsAndRoadmaps();  
      await seedRoadmapTagLinks();
    }


    // 4) Crear admin si no existe
    await createAdminUser();

    // 5) Levantar server
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
