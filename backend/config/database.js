// backend/config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const {
  DB_DIALECT = "mysql",
  DB_HOST,
  DB_PORT = 3306,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_SSL = "true",
  DB_CA_PEM, // certificado CA completo (BEGIN/END) pegado en env de Render
} = process.env;

// ---- SSL para Aiven ----
const useSSL = DB_SSL === "true";
let dialectOptions = {};
if (useSSL) {
  dialectOptions.ssl = DB_CA_PEM
    ? { ca: DB_CA_PEM, rejectUnauthorized: true, minVersion: "TLSv1.2" }
    : { rejectUnauthorized: true, minVersion: "TLSv1.2" };
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT,
  logging: false, // cámbialo a console.log si necesitas ver SQL
  dialectOptions,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

export default sequelize;
