import { useContext, useState} from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileDelete(){
     const { user, logout} = useContext(AuthContext);
     const [eliminar, setEliminar] = useState(false);
    const [error, setError] = useState("");
     const navigate = useNavigate();

     const isEliminar  = async () => {
        setEliminar(true);
     }

     const definitivamente = async () => {
        const token = localStorage.getItem("token");
        setError("");
        try{

            await axios.patch(`http://localhost:5000/users/delete/${user.id}`, 
                {status: false},
                { 
            headers: { Authorization: `Bearer ${token}` }
        });
        setError("La cuenta fue eliminada con exito, redirigiendo a pagina principal");

       logout();
        setTimeout(() => {
            navigate("/home");
        }, 5000);
        }catch(err){
            console.log(err);
            setError("Error al eliminar la cuenta");
        }
     }
      
          return (
              <div>
                  <h1>Eliminar cuenta</h1>
                  {!eliminar ? (
                      <div>
                          <h2>¿Eliminar cuenta?</h2>
                         
                        <div className='field'>
                            <button 
                                type="submit" 
                                className='boton'
                                onClick={isEliminar}
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                          
                      </div>
                      
                  ) : (
                     <div>
                          <h2>¿Eliminar cuenta definitivamente?</h2>
                         <p>La cuenta no podra ser recuperada</p>
                        <div className='field'>
                            <button 
                                type="submit" 
                                className='boton'
                                onClick={definitivamente}
                            >
                                Eliminar cuenta definitivamente
                            </button>
                        </div>
                          
                      </div>
                  )}

                  <div>
                    {error && (
                        <p>{error}</p>
                    )}
                  </div>

              </div>
          );
      }
      
export default ProfileDelete;

