import { NavLink, Outlet } from "react-router-dom";
import RecommendedRoadmaps from "./RecommendedRoadmaps";
import "./profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>

      <nav className="profile-tabs">
        <NavLink to="info" className="nav-link">Información</NavLink>
        <NavLink to="edit" className="nav-link">Editar Perfil</NavLink>
        
        <NavLink to="delete" className="nav-link">Eliminar Cuenta</NavLink>
      </nav>

      <section className="profile-recommendations">
        <RecommendedRoadmaps />
      </section>

      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
