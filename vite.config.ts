import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import portfolio from "./portfolio.config.ts";
import bloom from "./scripts/vite-plugin-bloom.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), bloom(portfolio)],
});
