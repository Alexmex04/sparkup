import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/login.css";
import { api } from "../../../utils/api"; // usa base /api según VITE_API_URL

function ResetPassword() {
  const [mensaje, setMensaje] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [pass, setPass] = useState("");
  const [passC, setPassC] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const validatePass = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // 8+ chars
    return passwordRegex.test(pass);
  };

  const ResetPass = async (e) => {
    e.preventDefault();
    setMensaje("");
    setErrorMensaje("");

    if (!validatePass()) {
      setErrorMensaje(
        "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial."
      );
      return;
    }

    if (pass !== passC) {
      setErrorMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      // sin host; respeta VITE_API_URL desde utils/api.js
      await api.post(`/auth/reset-password/${token}`, { password: pass });
      setMensaje("Contraseña actualizada correctamente. Redirigiendo al login…");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error(error);
      setErrorMensaje("Error en el cambio de contraseña.");
    }
  };

  return (
    <div className="login-page theme-dark">
      <div className="login-card">
        <h2 className="login-title">Resetear contraseña</h2>

        {mensaje && <p className="alert ok">{mensaje}</p>}
        {errorMensaje && <p className="alert error">{errorMensaje}</p>}

        <form onSubmit={ResetPass}>
          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <div className="control">
              <input
                type="password"
                className="form-input"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field" style={{ margin: "20px 0" }}>
            <label className="form-label">Confirma contraseña</label>
            <div className="control">
              <input
                type="password"
                className="form-input"
                value={passC}
                onChange={(e) => setPassC(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <button type="submit" className="btn-primary full" style={{ margin: "20px 0" }}>
              Cambiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
