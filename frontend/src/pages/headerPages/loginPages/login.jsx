import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./style/login.css";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { api } from "../../../utils/api"; // usa el cliente centralizado

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [errors, setErrors] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setMensaje(null);

    try {
      // sin host; respeta VITE_API_URL (o fallback seguro) desde utils/api.js
      const res = await api.post("/auth/login", { email, password });

      // tu flujo actual
      login(res.data.user, res.data.token);
      setMensaje("Login exitoso, redirigiendo a pagina principal");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Error al iniciar sesión. Intenta de nuevo.";
      setErrors(msg);
    }
  };

  return (
    <div className="login-page theme-dark">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Iniciar sesión</h2>
          <p className="sub">Accede a tu cuenta para continuar</p>
        </div>

        {errors && <div className="alert error">{errors}</div>}
        {mensaje && <div className="alert ok">{mensaje}</div>}

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@correo.com"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary full">
            Iniciar sesión
          </button>
        </form>

        <div className="login-footer">
          <span>¿No tienes cuenta?</span>
          <button type="button" className="btn-link" onClick={() => navigate("/register")}>
            Regístrate
          </button>
          <span>¿Olvidaste la contraseña?</span>
          <button type="button" className="btn-link" onClick={() => navigate("/forgot-password")}>
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
