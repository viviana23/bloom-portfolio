/**
 * Pre-renderiza el portfolio a HTML estático para que Google y las redes
 * lean todo el contenido sin ejecutar JavaScript.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const ssrDir = path.join(root, ".ssr");
const htmlPath = path.join(root, "dist", "index.html");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const html = fs.readFileSync(htmlPath, "utf8").replace("<!--app-->", render());

fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log("\n  ✓ Bloom Portfolio listo en /dist\n");
