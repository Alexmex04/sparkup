import {useState} from 'react';
import axios from "axios";
import './style/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");

    const currentUrl = "http://localhost:5000/api";

  const SendMail = async (e) => {
    e.preventDefault();
            if(!email){
            return;
        }
        
    try{

        await axios.post(`${currentUrl}/auth/forgotPassword`, {
            email: email
        });
        setMensaje("El correo se ha enviado con exito");
    }catch(error){
            console.error("Error completo:", error);
            setErrorMensaje("Error al enviar correo");
    
    }
  }; 
      
          return (
              <div className="login-page theme-dark">
                  

                <div className='login-card'>
                    <h2 className="login-title">Recuperación de contraseña</h2>

                  {mensaje && (
                    <div className="alert ok">
                                            {mensaje}
                                        </div>
                  )}

                    {errorMensaje && (
                    <div className="alert error">
                                            {errorMensaje}
                                        </div>
                  )}

                    <form onSubmit={SendMail}>
                        <div className='form-field'>
                            <label className='form-label'>Email</label>
                            <div className='control'>
                                <input
                                type="text"  
                                className='form-input'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="xxxxxx@gmail.com"
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
                            Recuperar
                            </button>
                        </div>


                  </form>



</div>

                  

              </div>
          );
      }
      
export default ForgotPassword;