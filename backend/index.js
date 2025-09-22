// backend/index.js
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // Cargar .env ANTES de leer process.env

// ===== DB / ORM =====
import sequelize from "./config/database.js";
import { initDatabase } from "./config/initDatabase.js";

// ===== MODELOS / ASOCIACIONES / SEEDERS =====
import { setupAssociations } from "./models/index.js";
import { createAdminUser } from "./config/adminSeeder.js";
import { seedTagsAndRoadmaps, seedRoadmapTagLinks } from "./config/seedTaxonomy.js";
import { Tag } from "./models/index.js";

// ===== RUTAS =====
import CatalogRoute from "./routes/CatalogRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import TaxonomyRoute from "./routes/TaxonomyRoute.js";
import LikesRoute from "./routes/LikesRoute.js";
import DiagnosticRoute from "./routes/diagnostic.js";
import predictRoutes from "./routes/predictRoute.js";
import MLDataRoute from "./routes/MLDataRoute.js";

const app = express();


const allowed = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// ===== RUTAS PÚBLICAS =====
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() })); // health pública
app.use("/api/catalog", CatalogRoute);  // catálogo PÚBLICO
app.use("/api", AuthRoute);
app.use(DiagnosticRoute);
app.use(predictRoutes);
app.use(MLDataRoute);

// ===== RUTAS PROTEGIDAS =====
app.use("/api", UserRoute);
app.use("/api", LikesRoute);
app.use("/api", TaxonomyRoute);

const PORT = process.env.PORT || 5000;

// Export para que otros módulos (LikesRoute) puedan emitir por Socket.IO
export let io;

// ========== Arranque ordenado ==========
(async () => {
  try {

    const runSyncFlag = process.env.RUN_SYNC_ON_START === "true";
    // 1) Crear/verificar DB solo en desarrollo (local)
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("[DB] sync(alter) aplicado (dev).");

    }else if (runSyncFlag){
      console.log("[DB] Producción: RUN_SYNC_ON_START=true → ejecutando sync(alter) una vez...");
      await sequelize.sync({ alter: true });
      console.log("[DB] Producción: sync(alter) OK. (Recuerda poner RUN_SYNC_ON_START=false y redeploy)");

    }else{
      console.log("[DB] Producción: no se ejecuta sync/alter (RUN_SYNC_ON_START no está activo).");
    }

    // 2) Conectar a la DB
    await sequelize.authenticate();
    console.log("[DB] Conexión OK");

    // 3) Asociaciones de modelos
    setupAssociations();

    // 4) Sincronización de esquemas
    //    En dev es cómodo usar alter; en prod evita alter/force (usa migraciones si aplica).
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("[DB] sync(alter) aplicado (dev).");
    } else if(runSyncFlag){
      console.log("[DB] Producción: RUN_SYNC_ON_START=true → ejecutando sync(alter) una vez...");
      await sequelize.sync({ alter: true });
      console.log("[DB] Producción: sync(alter) OK. (Recuerda poner RUN_SYNC_ON_START=false y redeploy)");      
    }else{
      console.log("[DB] Producción: no se ejecuta sync/alter (RUN_SYNC_ON_START no está activo).");
    }

    const runSeedFlag = process.env.RUN_SEED_ON_START === "true";

    // 5) Seeds controlados (solo si está vacío)
// 5) Seeds controlados (solo si está vacío, o forzado por flag)
  if (runSeedFlag) {
    console.log("[Seed] RUN_SEED_ON_START=true → forzando seed...");
    await seedTagsAndRoadmaps();
    await seedRoadmapTagLinks();
    await createAdminUser();
    console.log("[Seed] Datos base creados (forzado).");
  } else {
    if ((await Tag.count()) === 0) {
      await seedTagsAndRoadmaps();
      await seedRoadmapTagLinks();
      await createAdminUser();
      console.log("[Seed] Datos base creados (porque Tag estaba vacío).");
    } else {
      await createAdminUser();
      console.log("[Seed] Admin verificado/creado.");
    }
  }


    // 6) HTTP + Socket.IO
    const server = http.createServer(app);
    io = new SocketIOServer(server, {
      cors: { origin: allowed.length ? allowed : "*" }
    });

    io.on("connection", (socket) => {
      console.log("WS conectado:", socket.id);
      socket.on("join:user", (userId) => socket.join(`user:${userId}`));
      socket.on("disconnect", () => {
      });
    });

    // 7) Escuchar
    server.listen(PORT, () => {
      console.log(`API + WS escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("[Arranque] Error fatal:", err?.message || err);
    process.exit(1);
  }
})();
