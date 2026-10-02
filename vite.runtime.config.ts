/**
 * Compila el "runtime" de Bloom: los archivos fijos (JS, CSS y tipografías) que
 * el Editor de Bloom empaqueta dentro de cada portfolio descargado.
 * Salida: editor/public/runtime/ (la usa el editor; no se sube a git).
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(__dirname, "editor/public/runtime");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "bloom-runtime-manifest",
      closeBundle() {
        // Lista de archivos para que el editor sepa qué empaquetar.
        const files = fs.readdirSync(path.join(outDir, "assets"));
        fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({ files }, null, 2));
      },
    },
  ],
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/runtime.tsx"),
      output: {
        entryFileNames: "assets/bloom.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (info) => (info.names?.[0]?.endsWith(".css") ? "assets/bloom.css" : "assets/[name][extname]"),
      },
    },
  },
});
