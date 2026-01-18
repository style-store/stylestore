
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/stylestore/',
  server: {
    port: 5173,
    host: '0.0.0.0', // Escucha explícitamente en todas las IPs
    cors: true // Permite peticiones desde otros dispositivos
  }
});
