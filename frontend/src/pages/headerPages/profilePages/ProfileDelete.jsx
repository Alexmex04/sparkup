import { useContext, useState } from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api"; // 

function ProfileDelete() {
  const { user, logout } = useContext(AuthContext);
  const [eliminar, setEliminar] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const isEliminar = () => setEliminar(true);

  const definitivamente = async () => {
    setMsg("");
    try {
      //  sin host; interceptor añade Authorization
      await api.patch(`/users/delete/${user.id}`, { status: false });
      setMsg("La cuenta fue eliminada con éxito, redirigiendo…");
      logout();
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error(err);
      setMsg("Error al eliminar la cuenta");
    }
  };

  return (
    <div>
      <h1>Eliminar cuenta</h1>
      {!eliminar ? (
        <div>
          <h2>¿Eliminar cuenta?</h2>
          <div className="field">
            <button type="button" className="boton" onClick={isEliminar}>
              Eliminar cuenta
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>¿Eliminar cuenta definitivamente?</h2>
          <p>La cuenta no podrá ser recuperada</p>
          <div className="field">
            <button type="button" className="boton" onClick={definitivamente}>
              Eliminar cuenta definitivamente
            </button>
          </div>
        </div>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default ProfileDelete;
