import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; //encripta correos
import { v4 as uuidv4 } from 'uuid'; //generar tokens unicos
import User from "../models/UserModel.js"; //Importa el modelo de los usuarios
import { sendVerificationEmail, SendForgotEmail } from "../services/emailService.js"; //Importa la funcion para enviar correos
import { updatePass } from './UserController.js';

// ========== REGISTRO (envía token por correo) ==========
//Controlador para manejar el registro inicial del usuario
export const registerUser = async (req, res) => {
   
    try {
        //Se extraen los datos
        const { firstName, lastName, email, password } = req.body;
        //Verifica que los campos esten llenos
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ msg: "Campos obligatorios" });
        }
        //verifica si el correo ya esta registrado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Correo invalido" });
        }

        // Generar token de verificación
        const verificationToken = uuidv4();

       
        // Enviar correo de verificación
        await sendVerificationEmail(email, verificationToken);


// Devuelve una respuesta indicando que el correo fue enviado
        return res.status(200).json({
            success: true,
            msg: "Código de verificación enviado por correo",
            token: verificationToken,
            email: email 
        });
    } catch (error) {
        
        res.status(500).json({ msg: "Error al procesar el registro" });
    }
};



// ========== LOGIN ==========

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || user.status === false ) return res.status(401).json({ msg: 'Credenciales invalidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ msg: 'Credenciales invalidas' });

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.firstName + " " + user.lastName,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.status(200).json({
        msg: 'Login exitoso',
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role 
        }
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // 1. Verificar si el usuario existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "Si el email existe, se enviará un enlace de recuperación" });
        }

        // 2. Generar token JWT de recuperación (válido por 20 minutos)
        const resetToken = jwt.sign(
            { 
                email: user.email,
                purpose: 'password_reset'
            },
            process.env.JWT_SECRET,
            { expiresIn: '20m' }
        );
    
        // 3. Enviar correo con el enlace
        await SendForgotEmail(user.email, resetToken);

        res.status(200).json({ 
            msg: "Se ha enviado un enlace de recuperación a tu email",
            token: resetToken // Solo para desarrollo, quitar en producción
        });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ msg: "Error al procesar la solicitud" });
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await updatePass({
        params: {email: decoded.email},
        body: {newPassword: password}

      });  
      
      res.status(200).json({ msg: "Contraseña actualizada correctamente" });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ msg: "El enlace ha expirado" });
        }
        console.error("Error en resetPassword:", error);
        res.status(400).json({ msg: "Token inválido" });
    }
};