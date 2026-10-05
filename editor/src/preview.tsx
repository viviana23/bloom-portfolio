/**
 * Vista previa en vivo: recibe la configuración del editor (postMessage)
 * y dibuja el portfolio con los mismos componentes de la plantilla.
 */
import { createRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/fraunces/soft-italic.css";
import "@fontsource-variable/geist";
import "../../src/styles.css";
import { App } from "../../src/App";
import { ContentProvider, createContent } from "../../src/lib/content";
import { setSrcsetEnabled } from "../../src/lib/images";
import { paletteCss } from "../../src/lib/site";
import { resolveTheme } from "../../src/lib/themes";
import type { PortfolioConfig } from "../../src/lib/types";

export type PreviewMessage =
  | { type: "config"; config: PortfolioConfig; images: Record<string, string> }
  | { type: "scrollTo"; anchor: string };

/** Mensajes de la vista previa al editor. */
export type EditorMessage = { type: "preview-ready" } | { type: "edit"; anchor: string };

setSrcsetEnabled(false);
const root = createRoot(document.getElementById("root")!);
let userPickedTheme = false;

/** Reemplaza "/fotos/x.jpg" por la foto subida (blob:) para verla sin publicar. */
function withImages(config: PortfolioConfig, images: Record<string, string>): PortfolioConfig {
  return JSON.parse(JSON.stringify(config), (key, value) =>
    (key === "src" || key === "ogImage" || key === "url") && typeof value === "string" && images[value] ? images[value] : value,
  );
}

function render(config: PortfolioConfig, images: Record<string, string>) {
  const theme = resolveTheme(config.theme);
  const html = document.documentElement;
  html.lang = config.site.lang;
  html.dataset.style = theme.style;
  if (!userPickedTheme) {
    const dark =
      theme.defaultMode === "dark" ||
      (theme.defaultMode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    html.dataset.theme = dark ? "dark" : "light";
  }
  document.getElementById("bloom-theme")!.textContent =
    `:root,[data-theme="light"]{${paletteCss(theme.light)};color-scheme:light}` +
    `[data-theme="dark"]{${paletteCss(theme.dark)};color-scheme:dark}`;
  root.render(
    <ContentProvider content={createContent(withImages(config, images))}>
      <App />
    </ContentProvider>,
  );
}

// Si la persona usa el botón de tema dentro de la vista previa, respetamos su elección.
document.addEventListener("click", (e) => {
  if ((e.target as Element).closest("header button[aria-label^='Cambiar']")) userPickedTheme = true;
});

window.addEventListener("message", (e: MessageEvent<PreviewMessage>) => {
  if (e.origin !== location.origin) return;
  const msg = e.data;
  if (msg.type === "config") render(msg.config, msg.images);
  if (msg.type === "scrollTo") {
    const el = msg.anchor === "inicio" ? document.body : document.getElementById(msg.anchor);
    if (msg.anchor === "inicio") scrollTo({ top: 0, behavior: "smooth" });
    else el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ── Botón "Editar": al pasar sobre una sección, lleva al lugar del formulario ──
const SECTION_SELECTOR = "#inicio, main section[id], section#contacto";
const editBtn = document.createElement("button");
editBtn.type = "button";
editBtn.textContent = "✎ Editar esta sección";
editBtn.setAttribute("aria-hidden", "true");
editBtn.tabIndex = -1;
Object.assign(editBtn.style, {
  position: "fixed",
  zIndex: "60",
  display: "none",
  padding: "14px 24px",
  borderRadius: "999px",
  border: "0",
  background: "#7c3aed",
  color: "#fff",
  font: "700 18px/1 system-ui, -apple-system, sans-serif",
  boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
  cursor: "pointer",
} satisfies Partial<CSSStyleDeclaration>);
document.body.appendChild(editBtn);

let current: HTMLElement | null = null;
function placeButton() {
  if (!current) return void (editBtn.style.display = "none");
  const r = current.getBoundingClientRect();
  if (r.bottom < 90 || r.top > innerHeight) return void (editBtn.style.display = "none");
  editBtn.style.display = "block";
  editBtn.style.top = `${Math.max(88, r.top + 16)}px`;
  editBtn.style.right = "20px";
  current.style.outline = "2px dashed rgba(124, 58, 237, 0.55)";
  current.style.outlineOffset = "-6px";
}
function setCurrent(el: HTMLElement | null) {
  if (el === current) return placeButton();
  if (current) current.style.outline = "";
  current = el;
  placeButton();
}
const sectionAt = (target: EventTarget | null) =>
  (target instanceof Element ? target.closest<HTMLElement>(SECTION_SELECTOR) : null);

document.addEventListener("mouseover", (e) => {
  if (e.target === editBtn) return;
  setCurrent(sectionAt(e.target));
});
document.addEventListener("touchstart", (e) => setCurrent(sectionAt(e.target)), { passive: true });
document.documentElement.addEventListener("mouseleave", () => setCurrent(null));
addEventListener("scroll", placeButton, { passive: true });
editBtn.addEventListener("click", () => {
  if (current?.id) window.parent.postMessage({ type: "edit", anchor: current.id } satisfies EditorMessage, location.origin);
});

window.parent.postMessage({ type: "preview-ready" } satisfies EditorMessage, location.origin);
