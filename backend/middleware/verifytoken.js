// backend/middleware/verifytoken.js
import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  try {
    // 1) Authorization: Bearer <token>  ó  Authorization: <token>
    let auth = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (auth && typeof auth === "string") {
      const parts = auth.split(" ");
      token = parts.length === 2 ? parts[1] : auth.trim();
    }

    // 2) Alternativos: x-auth-token, x-access-token, token
    token = token
      || req.headers["x-auth-token"]
      || req.headers["x-access-token"]
      || req.headers["token"]
      || null;

    // 3) Query param / Cookie (opcional)
    token = token || req.query.token || req.cookies?.token || null;

    if (!token) {
      return res.status(403).json({ msg: "Token no proporcionado" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role || "user" };
    return next();
  } catch (err) {
    // Token vencido / inválido
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}

// (opcional) si usas admin:
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Requiere rol admin" });
  }
  next();
}
