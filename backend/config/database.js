import {Sequelize} from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
import { initDatabase } from './initDatabase.js'; // Importa el inicializador

// Verifica o crea la base de datos antes de usar Sequelize
await initDatabase(); // Esto es importante que se haga antes

//Se importa sequelize para inicializar la conexion con la base de datos
const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,

});
/**conexion de la base de datos
 * modular en este caso es el nombre d ela base de datos
 * root usuario para la conexion
 * 'root' es la contraseña del usuario.
 * host corre en local
 * dialect especifica que s eutilizara mysql
 * y expor esporta la conexion
 */
export default db;