/**
 * Arma el portfolio listo para publicar, en el navegador:
 * index.html pre-renderizado + runtime de Bloom + fotos optimizadas → un .zip.
 */
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { zipSync, strToU8 } from "fflate";
import { App } from "../../src/App";
import { ContentProvider, createContent } from "../../src/lib/content";
import { IMAGE_WIDTHS, setSrcsetEnabled, variantPath } from "../../src/lib/images";
import { headTags, htmlAttrs } from "../../src/lib/site";
import type { PortfolioConfig } from "../../src/lib/types";
import { usedImages } from "./finalize";

// ── Fotos ────────────────────────────────────────────────────────

async function toCanvas(blob: Blob, maxWidth: number): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la foto"))), type, quality),
  );

/** Al subir una foto: la dejamos en JPG de máximo 1600 px (más liviana y compatible). */
export async function prepareUpload(file: File): Promise<Blob> {
  const canvas = await toCanvas(file, 1600);
  return canvasBlob(canvas, "image/jpeg", 0.86);
}

/** ¿Este navegador puede crear imágenes WebP? (Chrome, Edge y Firefox sí) */
function canEncodeWebp(): boolean {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  return c.toDataURL("image/webp").startsWith("data:image/webp");
}

// ── Portfolio ────────────────────────────────────────────────────

function renderHtml(config: PortfolioConfig, srcset: boolean): string {
  setSrcsetEnabled(srcset);
  const body = renderToString(
    createElement(ContentProvider, { content: createContent(config), children: createElement(App) }),
  );
  setSrcsetEnabled(false);
  const json = JSON.stringify(config).replace(/</g, "\\u003c");
  return `<!doctype html>
<html ${htmlAttrs(config)}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headTags(config)}
    <link rel="stylesheet" href="/assets/bloom.css" />
  </head>
  <body>
    <div id="root">${body}</div>
    <script id="bloom-config" type="application/json" data-srcset="${srcset}">${json}</script>
    <script type="module" src="/assets/bloom.js"></script>
  </body>
</html>
`;
}

const README = `TU PORTFOLIO DE BLOOM
=====================

Esta carpeta es tu portfolio completo, listo para publicar.

CÓMO PUBLICARLO (gratis)
1. Entra a https://app.netlify.com/drop
2. Arrastra ESTA CARPETA a la página.
3. ¡Listo! Netlify te da la dirección de tu portfolio.
   Crea tu cuenta gratis para que tu portfolio no se borre.

CÓMO CAMBIAR TU PORTFOLIO DESPUÉS DE PUBLICARLO
Las veces que quieras:
1. Entra de nuevo al Editor de Bloom (https://www.qodira.com/bloom-editor).
   Tus textos y fotos siguen ahí, guardados en tu navegador.
2. Haz tus cambios y descarga tu portfolio otra vez.
3. En Netlify, abre tu sitio, ve a "Deploys" y arrastra la carpeta nueva.
   Tu portfolio se actualiza y conserva la misma dirección.
   (Arrástrala en "Deploys" de tu sitio, no en la página de Netlify Drop:
   ahí se crearía un sitio nuevo con otra dirección.)

¿Cambiaste de computadora? En el primer paso del editor usa
"Abrir un portfolio descargado" y elige esta carpeta.

No borres el archivo mi-portfolio.json: es tu información para poder
seguir editando.

Bloom es una iniciativa de Qodira · https://www.qodira.com/es/bloom
`;

export interface ExportProgress {
  (message: string): void;
}

/** Arma el .zip del portfolio. `images` son las fotos subidas en el editor. */
export async function buildPortfolioZip(
  config: PortfolioConfig,
  images: Map<string, Blob>,
  onProgress: ExportProgress = () => {},
): Promise<Blob> {
  const files: Record<string, Uint8Array> = {};
  const webp = canEncodeWebp();

  // 1. Runtime de Bloom (JS, CSS, tipografías)
  onProgress("Preparando el diseño…");
  const manifest = (await fetch(`${import.meta.env.BASE_URL}runtime/manifest.json`).then((r) => r.json())) as { files: string[] };
  await Promise.all(
    manifest.files.map(async (name) => {
      const buf = await fetch(`${import.meta.env.BASE_URL}runtime/assets/${name}`).then((r) => r.arrayBuffer());
      files[`assets/${name}`] = new Uint8Array(buf);
    }),
  );

  // 2. Fotos: original en JPG + versiones WebP livianas
  const paths = usedImages(config);
  let done = 0;
  for (const path of paths) {
    onProgress(`Preparando tus archivos (${++done} de ${paths.length})…`);
    const blob = images.get(path) ?? (await fetch(`${import.meta.env.BASE_URL}${path.slice(1)}`).then((r) => (r.ok ? r.blob() : undefined)));
    if (!blob) continue;
    files[path.slice(1)] = new Uint8Array(await blob.arrayBuffer());
    if (webp && path.startsWith("/fotos/")) {
      for (const width of IMAGE_WIDTHS) {
        const out = await canvasBlob(await toCanvas(blob, width), "image/webp", 0.78);
        files[variantPath(path, width).slice(1)] = new Uint8Array(await out.arrayBuffer());
      }
    }
  }

  // 3. Página, datos para seguir editando e instrucciones
  onProgress("Armando tu página…");
  files["index.html"] = strToU8(renderHtml(config, webp));
  files["mi-portfolio.json"] = strToU8(JSON.stringify({ bloom: 1, config }, null, 2));
  files["LEEME.txt"] = strToU8(README);
  files["404.html"] = files["index.html"];

  onProgress("Comprimiendo…");
  const zipped = zipSync(files, { level: 6 });
  return new Blob([zipped], { type: "application/zip" });
}

/** Descarga un archivo en el dispositivo. */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
