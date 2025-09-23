import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/register.css";
import { api } from "../../../utils/api"; //  usa base /api según VITE_API_URL

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPass]      = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailToken, setEmailToken] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) newErrors.email = "Ingresa un email válido";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
    if (!password.match(passwordRegex)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
    }

    if (!firstName.trim()) newErrors.firstName = "El nombre es requerido";
    if (!lastName.trim())  newErrors.lastName  = "Los apellidos son requeridos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 1) Envia registro (backend manda token por correo y también en la respuesta)
  const VerifyEmail = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, server: undefined }));

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data) {
        setRegistrationSuccess(true);
        if (response.data.token) {
          setEmailToken(response.data.token);
        }
      }
    } catch (error) {
      const msg = error?.response?.data?.msg || "No se pudo registrar. Intenta de nuevo.";
      setErrors((prev) => ({ ...prev, server: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2) Verifica el token que el usuario escribe
  const verifyToken = async () => {
    try {
      if (emailToken.slice(0, 5) === verificationToken) {
        setTokenError(false);
        await SaveUser();
      } else {
        setTokenError(true);
      }
    } catch {
      setTokenError(true);
    }
  };

  // 3) Guarda al usuario definitivo
  const SaveUser = async () => {
    try {
      await api.post("/user", {  
        firstName,
        lastName,
        email,
        password,
        emailToken,
      });

      setFinalMessage("Cuenta verificada con éxito. Redirigiendo al login en 5 segundos...");
      setTimeout(() => navigate("/login"), 5000);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setErrors((prev) => ({ ...prev, server: "No se pudo guardar el usuario" }));
    }
  };

  return (
    <div className="login-page theme-dark">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Registro</h2>
        </div>

        {registrationSuccess ? (
          <div>
            <p>¡Registro exitoso!</p>
            <p>Hemos enviado un correo de verificación</p>
            <p>Ingresa los caracteres para verificar la cuenta:</p>

            <input
              type="text"
              maxLength={5}
              className="form-input"
              value={verificationToken}
              onChange={(e) => setVerificationToken(e.target.value)}
              required
            />

            <div className="field-2">
              <button className="btn-primary full" onClick={verifyToken}>
                Verificar cuenta
              </button>
            </div>

            {tokenError && <p className="alert error">El código ingresado es incorrecto. Intenta de nuevo.</p>}
            {finalMessage && <div className="alert ok">{finalMessage}</div>}
          </div>
        ) : (
          <form onSubmit={VerifyEmail} className="login-form">
            {errors.server && <div className="alert error">{errors.server}</div>}

            {errors.email && (
              <div className="alert error">
                <p>{errors.email}</p>
              </div>
            )}

            {errors.password && (
              <div className="alert error">
                <p>{errors.password}</p>
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Nombre</label>
              <div className="control">
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Apellidos</label>
              <div className="control">
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellidos"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Email</label>
              <div className="control">
                <input
                  type="text"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Contraseña</label>
              <div className="control">
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <button type="submit" className="btn-primary full" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
