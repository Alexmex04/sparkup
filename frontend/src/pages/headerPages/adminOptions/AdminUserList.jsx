import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/AuthContext.jsx";

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.msg || "No tienes permisos");
            }
        };

        if (user?.role === "admin") fetchUsers(); 
    }, [token, user?.role]);

 

    const updateRole = async (userId, newRole) => {
    
        const token = localStorage.getItem("token");
        setError("");
        try{
            await axios.patch(`http://localhost:5000/users/${userId}`, 
                {role: newRole},
                { 
            headers: { Authorization: `Bearer ${token}` }
        });
        setError("Rol actualizado");

            // Recarga la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        }catch(err){
            console.log(err);
            setError("Error al actualizar rol");
        }
    }

    const updateStatus = async (userId, newStatus) => {
    
        const token = localStorage.getItem("token");
        setError("");
        try{
             const statusBoolean = newStatus === "true";
            await axios.patch(`http://localhost:5000/users/${userId}`, 
                {status: statusBoolean},
                { 
            headers: { Authorization: `Bearer ${token}` }
        });
        setError("Status actualizado");

            // Recarga la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        }catch(err){
            console.log(err);
            setError("Error al actualizar status");
        }
    }

    const DeleteDef = async (userId) => {
        //router.delete('/users/:id', verifyToken, requireAdmin, deleteUser);
        const token = localStorage.getItem("token");
        setError("");
        try{

            await axios.delete(`http://localhost:5000/users/${userId}`, 
               
                { 
            headers: { Authorization: `Bearer ${token}` }
        });

        setError("Usuario eliminado permanentemente");
                        // Recarga la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }catch(err){
            console.log(err);
            setError("Error al eliminar cuenta");
        }
    }

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            {error && <p>{error}</p>}


            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        {u.id} - 
                        {u.firstName} - 
                        {u.lastName} - 
                        {u.email} - 
                        <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        //onChange={(e)=>setRol(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>

                        <select
                        value={u.status.toString()} // Convertir booleano a string
                        onChange={(e) => updateStatus(u.id, e.target.value)}
                        >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                        </select>

                        <button
                            type="submit"
                            className='boton'
                            onClick={() => DeleteDef(u.id)}
                        >
                            Eliminar
                        </button>

                        
                        
                    </li>
                ))}
            </ul>

            
        </div>
    );
};


export default AdminUserList;