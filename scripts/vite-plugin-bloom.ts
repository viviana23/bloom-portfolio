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
import type { Palette, PortfolioConfig } from "../src/lib/types.ts";
import { emptySections, initials, linkIsAvailable, projects } from "../src/lib/content.ts";
import { paletteNames, resolveTheme, styles } from "../src/lib/themes.ts";
import { IMAGE_WIDTHS, variantPath } from "../src/lib/images.ts";

const DEMO_OG_HASH = "0e976c6ee97dba22";

// ── Color ────────────────────────────────────────────────────────
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function toRgb(hex: string): [number, number, number] {
  let h = hex.slice(1);
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** Texto legible sobre el color de acento: el que tenga más contraste. */
function onAccent(p: Palette): string {
  return [p.background, p.foreground, "#FFFFFF", "#111111"].reduce((best, c) =>
    contrast(c, p.accent) > contrast(best, p.accent) ? c : best,
  );
}

/** Texto legible sobre un color de bloque: foreground o background de la paleta. */
function onColor(c: string, p: Palette): string {
  return contrast(p.foreground, c) >= contrast(p.background, c) ? p.foreground : p.background;
}

function paletteCss(p: Palette): string {
  return [
    ...p.blocks.flatMap((c, i) => [`--block-${i + 1}:${c}`, `--on-block-${i + 1}:${onColor(c, p)}`]),
    `--bg:${p.background}`,
    `--fg:${p.foreground}`,
    `--accent:${p.accent}`,
    `--accent-fg:${onAccent(p)}`,
    `--muted:${p.muted}`,
    `--border:${p.border}`,
  ].join(";");
}

// ── Validación ───────────────────────────────────────────────────
function validate(config: PortfolioConfig, publicDir: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const need = (value: unknown, field: string) => {
    if (typeof value !== "string" || value.trim() === "") errors.push(`Falta el campo ${field}.`);
  };
  need(config.site.title, "site.title");
  need(config.site.description, "site.description");
  need(config.person.name, "person.name");
  need(config.person.role, "person.role");
  need(config.person.headline, "person.headline");

  const checkImage = (src: string | undefined, alt: string | undefined, where: string) => {
    if (!src) return;
    if (alt !== undefined && alt.trim() === "") {
      errors.push(`La imagen de ${where} no tiene texto alternativo (alt). Describe brevemente lo que se ve.`);
    }
    if (src.startsWith("/") && !fs.existsSync(path.join(publicDir, src))) {
      errors.push(`No encuentro la imagen "${src}" (${where}). Debe estar en la carpeta public${src}.`);
    }
  };

  checkImage(config.person.photo?.src, config.person.photo?.alt, "tu foto");
  checkImage(config.about?.photo?.src, config.about?.photo?.alt, "la foto de Sobre mí");
  checkImage(config.contact?.photo?.src, config.contact?.photo?.alt, "la foto de contacto");
  config.gallery?.items.forEach((img, i) => checkImage(img.src, img.alt, `la foto #${i + 1} de la galería`));
  checkImage(config.site.ogImage, undefined, "site.ogImage");
  checkImage(config.site.favicon, undefined, "site.favicon");

  if (config.person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.person.email)) {
    errors.push(`El email "${config.person.email}" no parece válido.`);
  }

  if (config.person.whatsapp !== undefined) {
    const digits = config.person.whatsapp.replace(/\D/g, "");
    if (digits && (digits.length < 8 || digits.length > 15)) {
      errors.push(
        `El WhatsApp "${config.person.whatsapp}" no parece válido. Escríbelo con código de país y sin espacios, ej. "573001234567".`,
      );
    }
  }
  if (!config.person.email && !config.person.whatsapp?.replace(/\D/g, "")) {
    warnings.push("No tienes email ni WhatsApp: los botones de contacto y encargo no se mostrarán.");
  }

  const allLinks = [
    ...config.links.map((l) => ({ l, where: "links" })),
    ...projects.flatMap((p) => (p.links ?? []).map((l) => ({ l, where: `el proyecto "${p.title}"` }))),
    ...(config.lab?.items ?? []).flatMap((i) => (i.link ? [{ l: i.link, where: `el laboratorio "${i.title}"` }] : [])),
    ...(config.services?.items ?? []).flatMap((s) => (s.cta ? [{ l: s.cta, where: `el servicio "${s.name}"` }] : [])),
  ];
  for (const { l, where } of allLinks) {
    if (!l.url || l.url.trim() === "" || l.url === "#") {
      errors.push(`El enlace "${l.label}" en ${where} está vacío. Pon una URL o bórralo.`);
    } else if (l.url.startsWith("http://")) {
      warnings.push(`El enlace "${l.label}" usa http://. Si es posible, usa https://.`);
    }
  }

  const seen = new Set<string>();
  projects.forEach((p, i) => {
    const where = `el proyecto #${i + 1}${p.title ? ` ("${p.title}")` : ""}`;
    if (!p.title) errors.push(`Falta el título (title) en ${where}.`);
    if (!p.summary) errors.push(`Falta el resumen (summary) en ${where}.`);
    if (seen.has(p.slug)) errors.push(`Dos proyectos tienen el mismo identificador "${p.slug}". Cambia el título o el slug.`);
    seen.add(p.slug);
    checkImage(p.cover?.src, p.cover?.alt, where);
    p.gallery?.forEach((img) => checkImage(img.src, img.alt, `la galería de ${where}`));
  });

  for (const mode of ["light", "dark"] as const) {
    const p = resolveTheme(config.theme)[mode];
    const { blocks, ...core } = p;
    const bad = [
      ...Object.entries(core),
      ...(Array.isArray(blocks) && blocks.length === 4
        ? blocks.map((b, i) => [`blocks[${i}]`, b] as [string, string])
        : [["blocks", "debe tener 4 colores"] as [string, string]]),
    ].filter(([, v]) => !HEX.test(v));
    if (bad.length) {
      bad.forEach(([k, v]) => errors.push(`El color theme.${mode}.${k} ("${v}") debe ser hexadecimal, ej. "#7A4A68".`));
      continue;
    }
    const pairs: ["foreground" | "muted" | "accent", number][] = [
      ["foreground", 7],
      ["muted", 4.5],
      ["accent", 3],
    ];
    for (const [key, min] of pairs) {
      const ratio = contrast(p[key], p.background);
      if (ratio < min) {
        warnings.push(
          `Contraste bajo en theme.${mode}.${key} sobre el fondo (${ratio.toFixed(1)}:1, recomendado ${min}:1). Puede costar leerlo.`,
        );
      }
    }
  }

  for (const id of emptySections) {
    warnings.push(`La sección "${id}" está activada (true) pero no tiene contenido, así que no se muestra. Complétala o ponla en false.`);
  }

  for (const cta of [config.hero?.primaryCta, config.hero?.secondaryCta]) {
    if (cta && !linkIsAvailable(cta.url)) {
      warnings.push(`El botón "${cta.label}" lleva a ${cta.url}, pero esa sección está oculta. El botón no se mostrará.`);
    }
  }

  // Contenido de demostración olvidado
  if (config.person.name === "Camila Ortega") {
    warnings.push("Todavía tienes el contenido de demostración (Camila Ortega). Reemplázalo en portfolio.config.ts.");
  }
  if (config.person.email?.endsWith("@example.com")) {
    warnings.push(`El email "${config.person.email}" es de ejemplo. Pon tu email real.`);
  }
  const og = config.site.ogImage && path.join(publicDir, config.site.ogImage);
  if (og && fs.existsSync(og) && createHash("sha256").update(fs.readFileSync(og)).digest("hex").startsWith(DEMO_OG_HASH)) {
    warnings.push("La imagen para redes (og-image.png) es la de la demo. Reemplázala o borra site.ogImage.");
  }

  const t = config.theme;
  if (t.palette && !paletteNames.includes(t.palette)) {
    errors.push(`La paleta "${t.palette}" no existe. Elige una de: ${paletteNames.join(", ")}.`);
  }
  if (t.style && !styles.includes(t.style)) {
    errors.push(`El estilo "${t.style}" no existe. Elige uno de: ${styles.join(", ")}.`);
  }

  if (config.site.url && !/^https:\/\/[^/]+/.test(config.site.url)) {
    warnings.push(`site.url debería empezar por https://, ej. "https://tunombre.com".`);
  }

  return { errors, warnings };
}

// ── HTML ─────────────────────────────────────────────────────────
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function absolute(base: string | undefined, p: string | undefined): string | undefined {
  if (!p) return undefined;
  if (/^https?:\/\//.test(p)) return p;
  return base ? base.replace(/\/$/, "") + p : undefined;
}

function faviconDataUri(config: PortfolioConfig): string {
  const light = resolveTheme(config.theme).light;
  const { accent } = light;
  const fg = onAccent(light);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${accent}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="${fg}">${esc(initials(config.person.name))}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function headTags(config: PortfolioConfig): string {
  const { site, person } = config;
  const theme = resolveTheme(config.theme);
  const url = site.url?.replace(/\/$/, "");
  const image = absolute(url, site.ogImage);
  const sameAs = config.links.map((l) => l.url).filter((u) => /^https?:\/\//.test(u));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: site.description,
    ...(url && { url }),
    ...(person.photo && { image: absolute(url, person.photo.src) ?? person.photo.src }),
    ...(person.email && { email: `mailto:${person.email}` }),
    ...(sameAs.length && { sameAs }),
  };

  const themeScript = `(function(){var d=document.documentElement,m;d.classList.add("js");try{m=localStorage.getItem("bloom-theme")}catch(e){}m=m||${JSON.stringify(theme.defaultMode)};var k=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);d.dataset.theme=k?"dark":"light";d.dataset.themeMode=m})()`;

  const tags = [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.description)}" />`,
    `<meta name="author" content="${esc(person.name)}" />`,
    url && `<link rel="canonical" href="${esc(url)}/" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${esc(site.title)}" />`,
    `<meta property="og:description" content="${esc(site.description)}" />`,
    `<meta property="og:locale" content="${esc(site.lang)}" />`,
    url && `<meta property="og:url" content="${esc(url)}/" />`,
    image && `<meta property="og:image" content="${esc(image)}" />`,
    image && `<meta property="og:image:alt" content="${esc(site.title)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${esc(site.title)}" />`,
    `<meta name="twitter:description" content="${esc(site.description)}" />`,
    image && `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${theme.light.background}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${theme.dark.background}" />`,
    `<link rel="icon" href="${site.favicon ? esc(site.favicon) : faviconDataUri(config)}" />`,
    `<style>:root,[data-theme="light"]{${paletteCss(theme.light)};color-scheme:light}[data-theme="dark"]{${paletteCss(theme.dark)};color-scheme:dark}</style>`,
    `<script>${themeScript}</script>`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n    ");
}

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
      const { errors, warnings } = validate(config, publicDir);
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
        .replace(/<html lang="[^"]*"/, `<html lang="${esc(config.site.lang)}" data-style="${resolveTheme(config.theme).style}"`)
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
