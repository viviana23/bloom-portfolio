/**
 * Editor de Bloom: una app aparte que reutiliza los componentes de la plantilla.
 * Antes de compilarla hay que compilar el runtime (vite.runtime.config.ts).
 *   npm run dev:editor    → editor en http://localhost:5174
 *   npm run build:editor  → dist-editor/ (listo para publicar)
 * BLOOM_EDITOR_BASE permite publicarlo bajo una ruta, ej. "/bloom-editor/".
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "editor"),
  base: process.env.BLOOM_EDITOR_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  build: {
    outDir: path.resolve(__dirname, "dist-editor"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        editor: path.resolve(__dirname, "editor/index.html"),
        preview: path.resolve(__dirname, "editor/preview.html"),
      },
    },
  },
});
