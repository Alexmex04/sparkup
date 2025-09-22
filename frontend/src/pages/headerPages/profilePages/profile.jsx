import { NavLink, Outlet } from "react-router-dom";
import RecommendedRoadmaps from "./RecommendedRoadmaps";

const Profile = () => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>

      <nav className="profile-tabs">
        <NavLink to="info" className={({ isActive }) => `tab-link ${isActive ? "active-tab" : ""}`}>Información</NavLink>
        <NavLink to="edit" className={({ isActive }) => `tab-link ${isActive ? "active-tab" : ""}`}>Editar Perfil</NavLink>
        <NavLink to="favorites" className={({ isActive }) => `tab-link ${isActive ? "active-tab" : ""}`}>Favoritos</NavLink>
        <NavLink to="delete" className={({ isActive }) => `tab-link ${isActive ? "active-tab" : ""}`}>Eliminar Cuenta</NavLink>
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
