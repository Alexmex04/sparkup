// frontend/src/pages/headerPages/loginPages/forgot-password.jsx
import { useState } from "react";
// ❌ import axios from "axios";  // ya no lo necesitamos aquí
import "./style/login.css";
import { api } from "../../../utils/api"; // ✅ cliente con baseURL correcta

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");

  const SendMail = async (e) => {
    e.preventDefault();
    setMensaje("");
    setErrorMensaje("");

    if (!email) return;

    try {
      // ✅ sin host: respeta VITE_API_URL en producción
      await api.post("/auth/forgotPassword", { email });
      setMensaje("El correo se ha enviado con éxito");
    } catch (error) {
      console.error("Error completo:", error);
      setErrorMensaje("Error al enviar correo");
    }
  };

  return (
    <div className="login-page theme-dark">
      <div className="login-card">
        <h2 className="login-title">Recuperación de contraseña</h2>

        {mensaje && <div className="alert ok">{mensaje}</div>}
        {errorMensaje && <div className="alert error">{errorMensaje}</div>}

        <form onSubmit={SendMail}>
          <div className="form-field">
            <label className="form-label">Email</label>
            <div className="control">
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xxxxxx@gmail.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <button type="submit" className="btn-primary full" style={{ margin: "20px 0" }}>
              Recuperar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
