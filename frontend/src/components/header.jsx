import { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import "./header.css";
import logo from "../assets/Logo_SparkUp.png";

function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const goMyBusiness = () => {
    if (user) navigate("/profile");
    else navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/home" className="logo-link" aria-label="Inicio">
          <img src={logo} alt="Logo del sitio" className="navbar-logo" />
        </Link>
      </div>
      <nav className="nav-right">
        <NavLink to="/roadmaps" className="nav-link">Roadmaps</NavLink>
        <NavLink to="/minegocio" className="nav-link">Mi negocio</NavLink>
        {isAdmin && <Link to="/options" className="nav-link">Opciones</Link>}
        {user ? (
          <NavLink to="/profile" className="login-button">Perfil</NavLink>
        ) : (
          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Log-In
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
