import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { useNavigate} from "react-router-dom";

function ProfileEdit(){
     const { user, updateUser} = useContext(AuthContext);
     const navigate = useNavigate();
        const [firstName, setFirstName] = useState(user.firstName);
         const [lastName, setLastName] = useState(user.lastName);
         const [email] = useState(user.email);
         const [password, setPass] = useState("");
         const [errors, setErrors] = useState("");
         const [successMessage, setSuccessMessage] = useState("");

const validateForm = () => {
        
        const newErrors = {};

        

        // Validación de contraseña
        if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/.test(password)) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
        }

        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };


    const EditProfile = async (e) => {
e.preventDefault();
if(!validateForm()){
    return;
}
const token = localStorage.getItem("token");
try{
        const payload = {};
        if (firstName !== user.firstName) payload.firstName = firstName;
        if (lastName !== user.lastName) payload.lastName = lastName;
        if (password) payload.password = password;


       if (Object.keys(payload).length === 0) {
            setErrors("No hay cambios para guardar");
            return;
        }


      await axios.patch(`http://localhost:5000/users/${user.id}`, payload, { 
            headers: { Authorization: `Bearer ${token}` }
        });

setSuccessMessage('Edicion completada redirigiendo al perfil');

  updateUser({ ...user, ...payload});

setTimeout(() => {
            navigate("/profile");
        }, 5000);
}catch(err){
    
console.log("Error de edicion", err.response?.data);
setErrors("error de edicion");
}
    };


          return (
              <div>
                  <h1>Editar perfil</h1>
                  <h2>{email}</h2>
                  <form onSubmit={EditProfile}>

                        <div className='field'>
                            <label className='label'>Nombre</label>
                            <div className='control'>
                                <input
                                type="text"
                                className='input'
                                value={firstName}
                                onChange={(e)=>setFirstName(e.target.value)}
                                placeholder="Nombre"
                               
                                />
                            </div>
                        </div>

                        <div className='field'>
                            <label className='label'>Apellidos</label>
                            <div className='control'>
                                <input
                                type="text"
                                className='input'
                                value={lastName}
                                onChange={(e)=>setLastName(e.target.value)}
                                placeholder="Apellidos"
                                
                                />
                            </div>
                        </div>


                   

                        <div className='field'>
                            <label className='label'>Contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='input'
                                value={password}
                                onChange={(e)=>setPass(e.target.value)}
                                placeholder="Pass"
                            
                                />
                            </div>
                            
                        </div>


                        <div className='field'>
                            <button 
                                type="submit" 
                                className='boton'
                                
                            >
                                Editar
                            </button>
                        </div>

                    <div>
                        
                        {errors.password && <p className="has-text-danger">{errors.password}</p>}
                        {successMessage && <p>{successMessage}</p>}
                    </div>
                    
                  </form>
                  
              </div>
          );
      }
      
export default ProfileEdit;