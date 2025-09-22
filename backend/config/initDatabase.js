// backend/config/initDatabase.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Verifica/crea la DB SOLO en desarrollo local.
 * En producción (Render + Aiven) NO se crea la DB aquí.
 */
export const initDatabase = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("[initDatabase] Omitido en producción.");
    return;
  }

  const DB_NAME = process.env.DB_NAME || "modular";

  try {
    // Para crear DB local, NO uses SSL ni puerto “raro” de Aiven:
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "hola",
      port: Number(process.env.DB_PORT) || 3306,
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await conn.end();
    console.log(`[initDatabase] DB '${DB_NAME}' verificada/creada (solo dev).`);
  } catch (e) {
    console.warn("[initDatabase] Aviso (dev):", e.message);
  }
};
