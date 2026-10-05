/**
 * Estado del editor: la configuración del portfolio, las fotos subidas y el paso actual.
 * Todo se guarda solo en el navegador.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { PortfolioConfig } from "../../src/lib/types";
import { db } from "./db";
import { ALL_SECTIONS, findProfession, sectionsFor, type Profession } from "./professions";

export interface EditorState {
  config: PortfolioConfig;
  professionId?: string;
  step: number;
  /** Versión del orden de secciones (2 = orden de la demo, con Contacto al final). */
  order?: number;
}

/** Pone las secciones en el orden recomendado (el de la demo), sin cambiar cuáles se ven. */
export function withRecommendedOrder(config: PortfolioConfig): PortfolioConfig {
  return { ...config, sections: Object.fromEntries(ALL_SECTIONS.map((k) => [k, config.sections[k] ?? false])) };
}

const STATE_KEY = "state";
const IMG_PREFIX = "img:";

/** Configuración inicial para una profesión: casi vacía, con sugerencias. */
export function blankConfig(prof: Profession): PortfolioConfig {
  const servicesFirst = prof.kind === "servicios";
  return {
    site: { lang: "es", title: "", description: "", showCredit: true, floatingButton: true },
    person: { name: "", role: prof.role, headline: "" },
    links: [],
    hero: {
      primaryCta: servicesFirst
        ? { label: "Ver servicios", url: "#servicios" }
        : { label: "Ver mi trabajo", url: "#proyectos" },
      secondaryCta: { label: "Contactarme", url: "#contacto" },
      marquee: prof.marquee,
    },
    sections: sectionsFor(prof.kind),
    about: { text: [""], points: [] },
    projects: { items: [] },
    gallery: { items: [] },
    services: { items: [] },
    testimonials: { items: [] },
    skills: { groups: [] },
    lab: { items: [] },
    experience: { items: [] },
    education: { items: [], certifications: [] },
    contact: {
      title: prof.kind === "carrera" ? "¿Trabajamos *juntas*?" : "¿Tienes algo *especial* en mente?",
      text: "Cuéntame qué necesitas y te respondo lo antes posible.",
    },
    theme: { style: prof.style, palette: prof.palette, defaultMode: "light" },
    labels: { ...prof.labels },
  };
}

/** Aplica una profesión a un portfolio que ya tiene contenido (solo el look y las palabras). */
export function applyProfession(config: PortfolioConfig, prof: Profession): PortfolioConfig {
  return {
    ...config,
    person: { ...config.person, role: config.person.role || prof.role },
    hero: { ...config.hero, marquee: config.hero?.marquee?.length ? config.hero.marquee : prof.marquee },
    theme: { ...config.theme, style: prof.style, palette: prof.palette },
    labels: { ...prof.labels },
  };
}

/** Ruta única para una foto nueva: /fotos/nombre-ab12.jpg */
export function newImagePath(fileName: string): string {
  const base =
    fileName
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "foto";
  return `/fotos/${base}-${Math.random().toString(36).slice(2, 6)}.jpg`;
}

export function useEditor() {
  const [state, setState] = useState<EditorState | null>(null);
  const [images, setImages] = useState<Map<string, Blob>>(new Map());
  const [saved, setSaved] = useState(true);
  /** Mensaje temporal arriba del formulario (ej. lo que llenó la IA). */
  const [notice, setNotice] = useState<string | null>(null);
  const loaded = useRef(false);

  // Cargar lo guardado
  useEffect(() => {
    // Pedimos al navegador que no borre estos datos por su cuenta cuando necesite espacio.
    navigator.storage?.persist?.().catch(() => {});
    (async () => {
      try {
        const stored = await db.get<EditorState>(STATE_KEY);
        const keys = (await db.keys()).filter((k): k is string => typeof k === "string" && k.startsWith(IMG_PREFIX));
        const map = new Map<string, Blob>();
        for (const k of keys) {
          const blob = await db.get<Blob>(k);
          if (blob) map.set(k.slice(IMG_PREFIX.length), blob);
        }
        setImages(map);
        // Portfolios guardados con el orden anterior: se pasan una sola vez al orden de la demo.
        const migrated = stored && stored.order !== 2 ? { ...stored, order: 2, config: withRecommendedOrder(stored.config) } : stored;
        setState(migrated ?? { config: blankConfig(findProfession("inicio")!), step: 0, order: 2 });
      } catch {
        setState({ config: blankConfig(findProfession("inicio")!), step: 0, order: 2 });
      }
      loaded.current = true;
    })();
  }, []);

  // Guardado automático (medio segundo después del último cambio)
  useEffect(() => {
    if (!state || !loaded.current) return;
    setSaved(false);
    const t = setTimeout(() => {
      db.set(STATE_KEY, state)
        .then(() => setSaved(true))
        .catch(() => setSaved(true));
    }, 500);
    return () => clearTimeout(t);
  }, [state]);

  /** Cambia la configuración con una función que recibe una copia editable. */
  const update = useCallback((fn: (draft: PortfolioConfig) => void) => {
    setState((s) => {
      if (!s) return s;
      const draft = structuredClone(s.config);
      fn(draft);
      return { ...s, config: draft };
    });
  }, []);

  const setStep = useCallback((step: number) => {
    setNotice(null);
    setState((s) => (s ? { ...s, step } : s));
  }, []);

  const chooseProfession = useCallback((prof: Profession) => {
    setState((s) => {
      if (!s) return s;
      const hasContent = Boolean(s.config.person.name.trim());
      const config = hasContent ? applyProfession(s.config, prof) : blankConfig(prof);
      return { ...s, professionId: prof.id, config };
    });
  }, []);

  const addImage = useCallback(async (path: string, blob: Blob) => {
    await db.set(IMG_PREFIX + path, blob);
    setImages((m) => new Map(m).set(path, blob));
  }, []);

  /** Empieza de cero: borra todo lo guardado. */
  const reset = useCallback(async () => {
    const keys = await db.keys();
    await Promise.all(keys.map((k) => db.del(String(k))));
    setImages(new Map());
    setState({ config: blankConfig(findProfession("inicio")!), step: 0, order: 2 });
  }, []);

  /** Carga el contenido que trajo la IA (o un archivo) y aplica la profesión si viene. */
  const loadImported = useCallback((config: PortfolioConfig, professionId?: string, summary?: string) => {
    setNotice(summary ?? "¡Listo! Cargamos tu portfolio. Revisa cada paso.");
    setState((s) => {
      const prof = findProfession(professionId);
      return {
        step: 1,
        order: 2,
        professionId: prof?.id ?? s?.professionId,
        config: prof ? applyProfession(config, prof) : config,
      };
    });
  }, []);

  /** Carga un portfolio descargado antes (su archivo mi-portfolio.json y sus fotos). */
  const importPortfolio = useCallback(async (config: PortfolioConfig, photos: Map<string, Blob>) => {
    for (const [path, blob] of photos) await db.set(IMG_PREFIX + path, blob);
    setImages((m) => new Map([...m, ...photos]));
    setState((s) => ({ step: 1, professionId: s?.professionId, config, order: 2 }));
  }, []);

  return { state, images, saved, notice, setNotice, update, setStep, chooseProfession, addImage, reset, importPortfolio, loadImported };
}

export type Editor = ReturnType<typeof useEditor>;
