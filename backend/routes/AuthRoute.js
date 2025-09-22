import express from "express";
import {
    registerUser, 
    loginUser,
    forgotPassword,
    resetPassword
} from "../controllers/AuthController.js";
import verifyToken from "../middleware/verifytoken.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgotPassword', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);

// Nueva ruta para obtener datos del usuario logueado
router.get("/me", verifyToken, async (req, res) => {
  try {
    const u = await User.findByPk(req.user.id);
    if (!u) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({
      id: u.id,
      firstName: u.first_name ?? u.firstName ?? "",
      lastName:  u.last_name  ?? u.lastName  ?? "",
      email: u.email,
      role: u.role || "user",
    });
  } catch (e) {
    console.error("GET /auth/me error:", e);
    return res.status(500).json({ msg: "me_failed" });
  }
});


export default router;