import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS modular');
    console.log("Base de datos 'modular' verificada o creada exitosamente.");
    await connection.end();
  } catch (error) {
    console.error('Error al crear/verificar la base de datos:', error.message);
    process.exit(1);
  }
};