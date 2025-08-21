/* eslint-disable no-undef */
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");
  const API_BASE_URL = env.VITE_API_BASE_URL;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: API_BASE_URL,
          changeOrigin: true
        }
      },
      host: "0.0.0.0",
      watch: {
        usePolling: true
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
  }
})
