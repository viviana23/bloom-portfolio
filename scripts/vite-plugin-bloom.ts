/**
 * Plugin de Vite de Bloom Portfolio.
 *
 * Lee `portfolio.config.ts` y:
 *  1. Valida el contenido y explica los errores en lenguaje claro.
 *  2. Inyecta SEO (title, description, Open Graph, canonical, author, JSON-LD).
 *  3. Inyecta los colores del tema como variables CSS (sin parpadeo).
 *  4. Genera un favicon con tus iniciales si no defines uno.
 *  5. Genera robots.txt y sitemap.xml cuando defines `site.url`.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import type { PortfolioConfig } from "../src/lib/types.ts";
import { esc, headTags, htmlAttrs, validateConfig } from "../src/lib/site.ts";
import { IMAGE_WIDTHS, variantPath } from "../src/lib/images.ts";

const DEMO_OG_HASH = "0e976c6ee97dba22";

// ── Imágenes ─────────────────────────────────────────────────────
/** Crea versiones WebP (640/1024/1600 px) de cada JPG/PNG publicado. */
async function optimizeImages(outDir: string) {
  const { default: sharp } = await import("sharp");
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(jpe?g|png)$/i.test(entry.name) && entry.name !== "og-image.png") files.push(full);
    }
  };
  walk(outDir);
  let before = 0;
  let after = 0;
  await Promise.all(
    files.map(async (file) => {
      before += fs.statSync(file).size;
      for (const width of IMAGE_WIDTHS) {
        const out = variantPath(file, width);
        await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
        if (width === 1024) after += fs.statSync(out).size;
      }
    }),
  );
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  console.log(`\n  ✓ ${files.length} fotos optimizadas (WebP): ${kb(before)} → ${kb(after)} en tamaño mediano`);
}

// ── Plugin ───────────────────────────────────────────────────────
export default function bloom(config: PortfolioConfig): Plugin {
  let publicDir = "public";
  let outDir = "dist";
  let isBuild = false;
  let isSsr = false;

  return {
    name: "bloom-portfolio",
    configResolved(resolved) {
      publicDir = resolved.publicDir;
      outDir = path.resolve(resolved.root, resolved.build.outDir);
      isSsr = Boolean(resolved.build.ssr);
      isBuild = resolved.command === "build" && !isSsr;
    },
    buildStart() {
      if (isSsr) return;
      const og = config.site.ogImage && path.join(publicDir, config.site.ogImage);
      const { errors, warnings } = validateConfig(config, {
        imageExists: (src) => fs.existsSync(path.join(publicDir, src)),
        isDemoOgImage: Boolean(
          og && fs.existsSync(og) && createHash("sha256").update(fs.readFileSync(og)).digest("hex").startsWith(DEMO_OG_HASH),
        ),
      });
      const log = (icon: string, msg: string) => console.log(`  ${icon} ${msg}`);
      if (warnings.length || errors.length) console.log("\n  Bloom Portfolio · revisión de portfolio.config.ts\n");
      warnings.forEach((w) => log("⚠︎", w));
      errors.forEach((e) => log("✕", e));
      if (errors.length) {
        const msg = `portfolio.config.ts tiene ${errors.length} ${errors.length === 1 ? "error" : "errores"}. Revisa los mensajes de arriba.`;
        if (isBuild) this.error(msg);
        else console.log(`\n  ${msg}\n`);
      }
    },
    transformIndexHtml(html) {
      return html
        .replace(/<html lang="[^"]*"/, `<html ${htmlAttrs(config)}`)
        .replace("<!--bloom:head-->", headTags(config));
    },
    async closeBundle() {
      if (isBuild) await optimizeImages(outDir);
    },
    generateBundle() {
      if (!isBuild || !config.site.url) return;
      const url = config.site.url.replace(/\/$/, "");
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(url)}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
      });
    },
  };
}
