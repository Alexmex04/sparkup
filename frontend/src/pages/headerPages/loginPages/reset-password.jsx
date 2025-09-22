import React,{useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './style/login.css';
const localUrl = "http://localhost:5000/api";
const currentUrl = localUrl;

function ResetPassword(){
    const [mensaje, setMensaje] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");
    const [pass, setPass] = useState("");
    const [passC, setPassC] = useState("");
     const navigate = useNavigate();
     const { token } = useParams();

    const validatePass = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
        if (!pass.match(passwordRegex)) {
            return false;
        }
    };

  const ResetPass = async (e) => {
    setMensaje("");
    e.preventDefault();
    if(!validatePass){
        setErrorMensaje("Tiene que tener extension de 8 caracteres, 1 mayuscula, 1 caracter especial y 1 numero");
        return;
    }

    if(pass!==passC){
        setMensaje("Las credenciales son diferentes");
        return;
    }


    try{
        await axios.post(`${currentUrl}/auth/reset-password/${token}` , {
            password: pass
        });
            setMensaje("Contraseña actualizada correctamente");
            // Redirigir después de 3 segundos
            setTimeout(() => navigate("/login"), 3000);
    }catch(error){
        console.log(error);
        setErrorMensaje("Error en el cambio de contraseña");
    }
  };
      
          return (
              <div className='login-page theme-dark'>
                <div className='login-card'>
                <h2 className="login-title">Resetear contraseña</h2>

                {mensaje && 
                <p className="alert ok">{mensaje}</p>
                }

                {errorMensaje && 
                <p className="alert error">{errorMensaje}</p>
                }

                  <form onSubmit={ResetPass}>
                        <div className='form-field'>
                            <label className='form-label'>Contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='form-input'
                                value={pass}
                                onChange={(e)=>setPass(e.target.value)}
            
                                required
                                />
                            </div>
                        </div>

                        <div className='form-field'  style={{ margin: '20px 0' }}>
                            <label className='form-label'>Confirma contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='form-input'
                                value={passC}
                                onChange={(e)=>setPassC(e.target.value)}
            
                                required
                                />
                            </div>
                        </div>

                        <div className='form-field'>
                            <button 
                                type="submit" 
                                       className="btn-primary full"
                                style={{ margin: '20px 0' }}
                                
                            >
                            Cambiar
                            </button>
                        </div>


                  </form>
                
                </div>
                  
              </div>
          );
      }
      
export default ResetPassword;