import { useContext, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext.jsx";
import {  NavLink, Outlet } from "react-router-dom";

const Options = () => {
  const { user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/home"); 
    }
  }, [user, navigate]);

  return (
    <div className="options-container">
      

      {/* Navegación tipo tabs */}
        <nav className="options-tabs">
            <NavLink 
            to="info" 
            className={({ isActive }) => 
                `tab-link ${isActive ? "active-tab" : ""}`
            }
            >
            Usuarios
            </NavLink>
            <NavLink 
            to="edit" 
            className={({ isActive }) => 
                `tab-link ${isActive ? "active-tab" : ""}`
            }
            >
            Recursos
            </NavLink>
        
        
        </nav>

      {/* Contenido de la subruta activa */}
      <div className="options-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Options;