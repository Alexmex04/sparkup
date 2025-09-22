import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // <-- Aquí faltaba cerrar el paréntesis
  server: {
    port: 3000, // Ahora sí usará el puerto 3000
    open: true // Para que abra el navegador automáticamente
  }
});