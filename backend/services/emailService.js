// Importa nodemailer para enviar correos
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';


// Permite obtener la ruta actual del archivo ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
 /*
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,    // Tu User de Mailtrap
        pass: process.env.MAILTRAP_PASS     // Tu Password de Mailtrap
    }
});
*/

const resend = new Resend(process.env.RESEND_API_KEY);


// Función para enviar correo de verificación
export const sendVerificationEmail = async (email, token) => {
    try {
        await resend.emails.send({
            from: `"SparkUp" <onboarding@sparkup25.xyz>`,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">¡Gracias por registrarte!</h2>
                    <p>Por favor verifica tu cuenta registrando los caracteres:</p>
                    <div style="background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #111827; letter-spacing: 2px;">${token.slice(0, 5)}</span>
                    </div>
                    <p style="margin-top: 20px;">Si no solicitaste este registro, ignora este mensaje.</p>
                </div>
            `
        });
      
        
      
    } catch (error) {
       console.log(error);
        throw error;
    }
};



export const SendForgotEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    try {
        await resend.emails.send({
            from: `"SparkUp" <onboarding@sparkup25.xyz>`,
            to: email,
            subject: 'Restablecer contraseña',
            html: `
                <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #2563eb;">Recuperación de contraseña</h2>
                <p>Haz clic en el botón para restablecer tu contraseña:</p>
                <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                    Restablecer contraseña
                </a>
                <p style="color: #ef4444; font-size: 14px;">
                    ⚠️ Este enlace expirará en 20 minutos.
                </p>

        <p style="margin-top: 20px;">Si no solicitaste este correo, ignora este mensaje.</p>
    </div>
            `
        });

      
    } catch (error) {
        console.error('Error al enviar correo:', error.message);
        throw error;
    }
};