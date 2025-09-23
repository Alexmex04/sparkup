import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { api } from "../../../utils/api"; // 

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //  /api/users (sin headers manuales; interceptor añade Authorization)
        const { data } = await api.get("/users");
        setUsers(data || []);
      } catch (err) {
        setError(err?.response?.data?.msg || "No tienes permisos");
      }
    };

    if (user?.role === "admin") fetchUsers();
  }, [user?.role]);

  const updateRole = async (userId, newRole) => {
    setError("");
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setError("Rol actualizado");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar rol");
    }
  };

  const updateStatus = async (userId, newStatus) => {
    setError("");
    try {
      const statusBoolean = newStatus === "true";
      await api.patch(`/users/${userId}`, { status: statusBoolean });
      setError("Status actualizado");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar status");
    }
  };

  const DeleteDef = async (userId) => {
    setError("");
    try {
      await api.delete(`/users/${userId}`);
      setError("Usuario eliminado permanentemente");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      setError("Error al eliminar cuenta");
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {error && <p>{error}</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.id} - {u.firstName} - {u.lastName} - {u.email} -{" "}
            <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={u.status?.toString?.() ?? "true"}
              onChange={(e) => updateStatus(u.id, e.target.value)}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <button type="button" className="boton" onClick={() => DeleteDef(u.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserList;
