import express from "express";
import {
    getUsers, 
    getUserById,  
    createUser,
    updateUser,
    deleteUser,
    updatePass,
    softDeleteUser
} from "../controllers/UserController.js";
import verifyToken,{ requireAdmin } from '../middleware/verifytoken.js';
//se crea instancia router
/**
 * path: Especifica la URL relativa que debe coincidir para que se ejecute la ruta. En este caso, /users.
handler: Es la función que maneja la solicitud cuando se accede a la ruta. Aquí, getUsers es la función importada desde el controlador UserController.js.
 */
const router = express.Router();


router.get('/users', verifyToken, requireAdmin, getUsers);
router.get('/users/:id', verifyToken, getUserById);
router.post('/user', createUser);
router.patch('/users/:id', verifyToken, updateUser);
router.patch('/users/update-pass/:email', updatePass);
router.delete('/users/:id', verifyToken, requireAdmin, deleteUser);
router.patch('/users/delete/:id', verifyToken, softDeleteUser)


export default router;

/* Flujo de esta ruta:
Cuando el cliente envía una solicitud GET a /users, el router ejecuta la función getUsers.
La función getUsers realiza la lógica necesaria, como consultar la base de datos y enviar una respuesta.
 */