import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Escucha en todas las interfaces (IPv4 y IPv6). Sin esto, en algunos
    // equipos Windows Vite solo enlaza "localhost" a ::1 (IPv6), y el
    // navegador (que resuelve "localhost" a 127.0.0.1 primero) recibe
    // ERR_CONNECTION_REFUSED aunque el proceso esté corriendo.
    host: true,
  },
})