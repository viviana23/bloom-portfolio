/**
 * Imágenes responsivas automáticas.
 *
 * Al publicar (npm run build), Bloom crea versiones WebP de cada foto de
 * /public en 640, 1024 y 1600 px. El navegador descarga solo la que necesita.
 * Tú solo subes tus JPG o PNG normales: no tienes que hacer nada más.
 */
export const IMAGE_WIDTHS = [640, 1024, 1600] as const;

const LOCAL_RASTER = /^\/.+\.(jpe?g|png)$/i;

/** Nombre de la versión optimizada: /fotos/pastel.jpg → /fotos/pastel-640.webp */
export function variantPath(src: string, width: number): string {
  return src.replace(/\.(jpe?g|png)$/i, `-${width}.webp`);
}

/** Atributos srcSet/sizes para una foto local (solo en producción). */
export function responsive(src: string, sizes: string): { srcSet?: string; sizes?: string } {
  if (!import.meta.env.PROD || !LOCAL_RASTER.test(src) || src.endsWith("og-image.png")) return {};
  return {
    srcSet: IMAGE_WIDTHS.map((w) => `${variantPath(src, w)} ${w}w`).join(", "),
    sizes,
  };
}
