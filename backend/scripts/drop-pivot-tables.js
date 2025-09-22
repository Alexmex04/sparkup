// backend/scripts/drop-pivot-tables.js
import dotenv from "dotenv";
dotenv.config();

import sequelize from "../config/database.js";

async function main() {
  try {
    console.log("[drop] Autenticando con Aiven…");
    await sequelize.authenticate();
    console.log("[drop] Conexión OK.");

    // Apagar chequeo de FKs temporalmente
    await sequelize.query("SET FOREIGN_KEY_CHECKS=0;");

    // Dropear las tablas pivote problemáticas si existen
    const tables = ["roadmap_tags", "user_liked_roadmaps", "user_liked_tags"];
    for (const t of tables) {
      try {
        console.log(`[drop] DROP TABLE IF EXISTS ${t} …`);
        await sequelize.query(`DROP TABLE IF EXISTS \`${t}\`;`);
      } catch (e) {
        console.warn(`[drop] Aviso al dropear ${t}:`, e?.message || e);
      }
    }

    // Volver a encender chequeo de FKs
    await sequelize.query("SET FOREIGN_KEY_CHECKS=1;");
    console.log("[drop] Listo ✔");
    process.exit(0);
  } catch (err) {
    console.error("[drop] Error:", err?.message || err);
    process.exit(1);
  }
}

main();
