/**
 * Bloom Portfolio — paletas y estilos listos para usar.
 *
 * No necesitas editar este archivo: elige una paleta y un estilo en
 * `portfolio.config.ts` (theme.palette y theme.style). Si quieres ajustar
 * un color, escríbelo en theme.light / theme.dark y se aplica encima.
 */
import type { Palette, PortfolioConfig } from "./types.ts";

export const styles = ["divertido", "elegante", "minimal"] as const;
export type StyleName = (typeof styles)[number];

export const paletteNames = ["fresa", "salvia", "arena", "lavanda", "tinta"] as const;
export type PaletteName = (typeof paletteNames)[number];

export const palettes: Record<PaletteName, { light: Palette; dark: Palette }> = {
  /** Crema, chocolate y fresa. Repostería, cocina, hecho a mano, eventos. */
  fresa: {
    light: {
      background: "#FFF8F1",
      foreground: "#3B1E16",
      accent: "#C8305F",
      muted: "#7B5A4E",
      border: "#F0DDD2",
      blocks: ["#F8C6D3", "#D4E7C1", "#FBE3A0", "#DCD0F4"],
    },
    dark: {
      background: "#1C110D",
      foreground: "#FFF1E8",
      accent: "#FF8CAE",
      muted: "#CDAE9F",
      border: "#3B2820",
      blocks: ["#6A2439", "#2E4A2C", "#6E4118", "#3E3266"],
    },
  },
  /** Verdes salvia y arena. Bienestar, yoga, nutrición, plantas, terapias. */
  salvia: {
    light: {
      background: "#F7F6F0",
      foreground: "#1F2A24",
      accent: "#3F6B4F",
      muted: "#5E6B62",
      border: "#E1E4D8",
      blocks: ["#DCE8D5", "#F1E3CF", "#E6DDF0", "#F6D9CC"],
    },
    dark: {
      background: "#121814",
      foreground: "#EEF2EA",
      accent: "#9CCBA8",
      muted: "#A4B0A6",
      border: "#26302A",
      blocks: ["#27402F", "#4A3B26", "#3A3350", "#553328"],
    },
  },
  /** Beige, cognac y neutros cálidos. Coaching, arquitectura, interiorismo, bodas. */
  arena: {
    light: {
      background: "#FAF7F2",
      foreground: "#2B2622",
      accent: "#8A5A3B",
      muted: "#6F665E",
      border: "#E8E0D6",
      blocks: ["#EFE6DA", "#E3E8E4", "#F2E2DC", "#E6E1EE"],
    },
    dark: {
      background: "#17130F",
      foreground: "#F4EEE6",
      accent: "#D9A77E",
      muted: "#B3A89C",
      border: "#2E2721",
      blocks: ["#3A2F25", "#28302B", "#3D2A25", "#2F2B38"],
    },
  },
  /** Lavanda y colores creativos. Ilustración, diseño, educación, contenido. */
  lavanda: {
    light: {
      background: "#FBF8FF",
      foreground: "#2A1F3D",
      accent: "#7C3AED",
      muted: "#6B6280",
      border: "#E9E2F5",
      blocks: ["#E4D9FB", "#FBD9E6", "#D8ECF7", "#FDEBC8"],
    },
    dark: {
      background: "#150F22",
      foreground: "#F3EEFF",
      accent: "#B79BFF",
      muted: "#B1A7C8",
      border: "#2C2340",
      blocks: ["#3A2A66", "#5A2440", "#1F3E52", "#5A4520"],
    },
  },
  /** Tinta negra y un acento terracota. Fotografía, moda, consultoría, tecnología. */
  tinta: {
    light: {
      background: "#F5F3EF",
      foreground: "#141414",
      accent: "#C2410C",
      muted: "#5F5B55",
      border: "#E2DED7",
      blocks: ["#E9E5DE", "#F3D9C9", "#DCDCD6", "#F1E6C6"],
    },
    dark: {
      background: "#0E0E0E",
      foreground: "#F2EFEA",
      accent: "#FF8A5B",
      muted: "#A8A39B",
      border: "#262422",
      blocks: ["#24211F", "#3B2519", "#2E2E2B", "#3A3220"],
    },
  },
};

export interface ResolvedTheme {
  style: StyleName;
  defaultMode: "light" | "dark" | "system";
  light: Palette;
  dark: Palette;
}

/** Paleta elegida + tus ajustes de color encima. */
export function resolveTheme(theme: PortfolioConfig["theme"]): ResolvedTheme {
  const base = palettes[theme.palette ?? "fresa"] ?? palettes.fresa;
  const merge = (p: Palette, over?: Partial<Palette>): Palette => ({
    ...p,
    ...over,
    blocks: (over?.blocks ?? p.blocks) as Palette["blocks"],
  });
  return {
    style: theme.style ?? "divertido",
    defaultMode: theme.defaultMode ?? "system",
    light: merge(base.light, theme.light),
    dark: merge(base.dark, theme.dark),
  };
}
