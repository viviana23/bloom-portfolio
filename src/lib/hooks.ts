import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Añade `is-visible` cuando el elemento entra en pantalla (una sola vez). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ── Tema ─────────────────────────────────────────────────────────
export type ThemeMode = "light" | "dark" | "system";
const STORAGE_KEY = "bloom-theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(mode: ThemeMode) {
  const dark = mode === "dark" || (mode === "system" && media().matches);
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.dataset.themeMode = mode;
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getMode = () => (document.documentElement.dataset.themeMode as ThemeMode) || "system";

export function useTheme() {
  // En el servidor no hay preferencia: devolvemos null y la UI se hidrata sin desajustes.
  const mode = useSyncExternalStore(subscribe, getMode, () => null);
  // Tema que se ve de verdad ("light" o "dark"), también cuando sigue al sistema.
  const resolved = useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme as "light" | "dark") || "light",
    () => null,
  );

  useEffect(() => {
    const mq = media();
    const onChange = () => {
      if (getMode() !== "system") return;
      applyTheme("system");
      listeners.forEach((l) => l());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* modo privado: el tema se aplica igual durante la visita */
    }
    listeners.forEach((l) => l());
  }, []);

  return { mode, resolved, setMode };
}

/** Sección activa según el scroll (para resaltar la navegación). */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]!;
          setActive(top.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}
