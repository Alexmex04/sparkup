import React, { useContext } from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./profile.css";

function ProfileInfo(){
     const { user, logout } = useContext(AuthContext);
     const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home"); 
  };
      
          return (
              <div>
                  <h1>Información del perfil</h1>
                  {user ? (
                      <div>
                          
                          <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                          <p><strong>Email:</strong> {user.email}</p>
                        
                           <button onClick={handleLogout} className="boton-perfil">Cerrar sesión</button>
                      </div>
                      
                  ) : (
                      <p>Cargando datos del usuario...</p>
                  )}
              </div>
          );
      }
      
export default ProfileInfo;