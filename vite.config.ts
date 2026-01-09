import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: [
      ".trycloudflare.com",
      "10.151.199.45",
      "localhost",
      "127.0.0.1"
    ],
    strictPort: true,
    open: false,
    cors: true,
    hmr: {
      port: 3000
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot']
        }
      }
    }
  }
}));
