import bcrypt from 'bcryptjs'; //encripta correos
import User from "../models/UserModel.js"; //Importa el modelo de los usuarios

// ========== CREAR USUARIO (cuando token es correcto) ==========
export const createUser = async(req, res) =>{
    try{
                console.log(req.headers);
        //verifica que los campos esten llenos por parte del backend
        // Destructure all needed fields from req.body
        const { firstName, lastName, email, password, emailToken } = req.body;
        
        // Verify required fields
        if (!firstName || !lastName || !email || !password || !emailToken) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        //se encripta la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Se crea el usuario con la contraseña encriptada
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            emailToken,
        });

        //await User.create(req.body);
        res.status(201).json({msg: "Usuario creado"});
        }
    catch (error){
        console.log(error.message);
        res.status(500).json({ msg: "Error al crear el usuario", error: error.message });

    }
}


//Se importa el modelo User, que representa la tabla users en la base de datos
//Interactua con la base de datos 
/**Funcion asincrona devuelve promesas
 * Se usa await para esperar resultados d euna consulta
 * Response = user.findall, obtiene todos los registros de la tabla users y se almacena en response
 * res.status(200).json(esponse), establece el codigo de estado http de la respuesta 200
 * json envia los datos en formato json
 * y si hay error este lo captura
 */
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getUserById = async(req, res) =>{
    try{
        const response = await User.findOne({
            where:
            {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const updatePass = async(req) =>{
    try{
        const { email } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({ password: hashedPassword });

    } catch (error){
        throw error;
        
    }
}


export const updateUser = async (req, res) => {
   
    const { password, ...otherFields } = req.body;
    const updateData = { ...otherFields };

    if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }

    try {
        
        const result = await User.update(updateData, {
            where: { id: parseInt(req.params.id) }
        });

        if (result[0] === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado o sin cambios" });
        }

        return res.status(200).json({ msg: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: "Error al actualizar usuario" });
    }
};


export const deleteUser = async(req, res) =>{
    try{
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ msg: "ID inválido" });
        }

        const deleted = await User.destroy({
            where: { id: parseInt(req.params.id) }
        });

        if (deleted === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        return res.status(200).json({ msg: "Usuario eliminado correctamente" });

        }
    catch (error){
        console.log(error.message);
        return res.status(500).json({msg: "Error al eliminar cuenta"});
    }
};


export const softDeleteUser = async (req, res) => {
        if (req.user.id !== userId && req.user.role !== "admin") {
  return res.status(403).json({ msg: "No autorizado para eliminar esta cuenta" });
}

  try {


    const result = await User.update(
      { status: false },
      { where: { id: parseInt(req.params.id) } }
    );

    if (result[0] === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Cuenta desactivada correctamente" });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Error al desactivar la cuenta" });
  }
};