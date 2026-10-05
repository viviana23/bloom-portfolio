import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { cleanConfig } from "./finalize";
import { findProfession } from "./professions";
import { useEditor } from "./store";
import type { EditorMessage, PreviewMessage } from "./preview";
import { sectionAnchor } from "../../src/lib/content";
import type { SectionId } from "../../src/lib/types";
import { STEP_FOR_SECTION } from "./steps/shared";
import { AboutStep, ContactStep } from "./steps/AboutContact";
import { PublishStep } from "./steps/PublishStep";
import type { StepProps } from "./steps/shared";
import { StartStep, StyleStep } from "./steps/StartStyle";
import { OfferStep, TrajectoryStep, WorkStep } from "./steps/WorkSteps";
import type { ImageCtx } from "./ui/fields";

const steps: { title: string; intro: string; anchor: string; Step: ComponentType<StepProps> }[] = [
  { title: "Empieza", intro: "Cuéntanos a qué te dedicas y preparamos tu portfolio.", anchor: "inicio", Step: StartStep },
  { title: "Sobre ti", intro: "Tu nombre, tu frase y tu foto. Lo primero que ven.", anchor: "inicio", Step: AboutStep },
  { title: "Tu trabajo", intro: "Muestra lo que haces: proyectos y fotos.", anchor: "proyectos", Step: WorkStep },
  { title: "Lo que ofreces", intro: "Tus servicios y lo que dicen tus clientes.", anchor: "servicios", Step: OfferStep },
  { title: "Trayectoria", intro: "Opcional: lo que sabes, lo que has hecho y lo que estás aprendiendo.", anchor: "laboratorio", Step: TrajectoryStep },
  { title: "Contacto", intro: "Cómo te escriben y dónde te siguen.", anchor: "contacto", Step: ContactStep },
  { title: "Tu estilo", intro: "Elige el carácter y los colores de tu portfolio.", anchor: "inicio", Step: StyleStep },
  { title: "Publicar", intro: "Descárgalo y ponlo en internet, gratis.", anchor: "inicio", Step: PublishStep },
];

const BASE = import.meta.env.BASE_URL;

export function EditorApp() {
  const editor = useEditor();
  const { state, images, saved } = editor;
  const iframe = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const formTop = useRef<HTMLDivElement>(null);

  // URLs temporales para ver las fotos subidas
  const urls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [path, blob] of images) map[path] = URL.createObjectURL(blob);
    return map;
  }, [images]);
  useEffect(() => () => Object.values(urls).forEach((u) => URL.revokeObjectURL(u)), [urls]);

  const ctx: ImageCtx = useMemo(
    () => ({ images, urlFor: (p: string) => urls[p], addImage: editor.addImage }),
    [images, urls, editor.addImage],
  );

  const prof = findProfession(state?.professionId) ?? findProfession("inicio");

  const send = useCallback((msg: PreviewMessage) => {
    iframe.current?.contentWindow?.postMessage(msg, location.origin);
  }, []);

  // Al tocar "Editar" en la vista previa: ir al paso y al bloque correspondiente.
  const pendingCard = useRef<string | null>(null);
  const goToSection = useCallback(
    (anchor: string) => {
      const id = (Object.keys(sectionAnchor) as SectionId[]).find((k) => sectionAnchor[k] === anchor);
      const step = anchor === "inicio" ? 1 : id ? STEP_FOR_SECTION[id].step : null;
      if (step === null) return;
      pendingCard.current = `card-${anchor}`;
      setMobileView("edit");
      editor.setStep(step);
    },
    [editor.setStep],
  );

  useEffect(() => {
    const onMsg = (e: MessageEvent<EditorMessage>) => {
      if (e.origin !== location.origin) return;
      if (e.data?.type === "preview-ready") setReady(true);
      if (e.data?.type === "edit") goToSection(e.data.anchor);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [goToSection]);

  // Enviar la configuración a la vista previa (con un pequeño respiro mientras escribe)
  useEffect(() => {
    if (!ready || !state) return;
    const t = setTimeout(() => send({ type: "config", config: cleanConfig(state.config, { placeholders: prof }), images: urls }), 150);
    return () => clearTimeout(t);
  }, [ready, state, urls, prof, send]);

  // Al cambiar de paso, la vista previa va a la sección correspondiente
  const step = state?.step ?? 0;
  useEffect(() => {
    const card = pendingCard.current;
    if (card) {
      // Venimos de "Editar" en la vista previa: mostrar y resaltar ese bloque.
      pendingCard.current = null;
      setTimeout(() => {
        const el = document.getElementById(card);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.style.boxShadow = "0 0 0 4px rgba(124, 58, 237, 0.45)";
        setTimeout(() => (el.style.boxShadow = ""), 1600);
      }, 120);
      return;
    }
    if (ready) send({ type: "scrollTo", anchor: steps[step]!.anchor });
    formTop.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [step, ready, send]);

  if (!state) {
    return <div className="grid min-h-dvh place-items-center text-ink/60">Cargando tu editor…</div>;
  }

  const { Step, title, intro } = steps[step]!;
  const go = (i: number) => editor.setStep(Math.max(0, Math.min(steps.length - 1, i)));

  return (
    <div className="flex min-h-dvh flex-col bg-paper lg:h-dvh lg:overflow-hidden">
      {/* Barra superior */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-4 md:px-6">
        <a href="https://www.qodira.com/es/bloom" className="flex items-center gap-2.5" target="_blank" rel="noopener">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-brand font-serif text-lg italic text-white">B</span>
          <span className="leading-tight">
            <span className="block text-[0.9375rem] font-bold text-ink">Editor de Bloom</span>
            <span className="block text-[0.75rem] text-ink/50">una iniciativa de Qodira</span>
          </span>
        </a>
        <p aria-live="polite" className="text-[0.8125rem] font-medium text-ink/50">
          {saved ? (
            <>
              ✓ Guardado<span className="hidden sm:inline"> en este navegador</span>
            </>
          ) : (
            "Guardando…"
          )}
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Formulario */}
        <div
          ref={formTop}
          className={`w-full overflow-y-auto pb-28 lg:w-[min(46%,40rem)] lg:shrink-0 lg:border-r lg:border-line lg:pb-10 ${mobileView === "preview" ? "hidden lg:block" : ""}`}
        >
          <nav aria-label="Pasos" className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 py-3 backdrop-blur md:px-6">
            <ol className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === step ? "step" : undefined}
                    ref={(el) => {
                      if (el && i === step) el.scrollIntoView({ block: "nearest", inline: "center" });
                    }}
                    className={`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[0.8125rem] font-semibold transition ${
                      i === step ? "bg-ink text-white" : i < step ? "text-ink hover:bg-ink/5" : "text-ink/45 hover:bg-ink/5"
                    }`}
                  >
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.6875rem] ${i === step ? "bg-white text-ink" : "bg-ink/10"}`}>{i + 1}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
            <div>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brand">
                Paso {step + 1} de {steps.length}
              </p>
              <h1 className="mt-1 font-serif text-[2rem] leading-tight text-ink">{title}</h1>
              <p className="mt-1 text-[0.9375rem] text-ink/60">{intro}</p>
            </div>

            {editor.notice && (
              <div role="status" className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-[0.9375rem] text-emerald-900">
                <span aria-hidden="true" className="mt-0.5 text-lg">✓</span>
                <p className="flex-1 leading-relaxed">{editor.notice}</p>
                <button type="button" onClick={() => editor.setNotice(null)} aria-label="Cerrar aviso" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-emerald-100">
                  ✕
                </button>
              </div>
            )}

            <Step editor={editor} ctx={ctx} prof={prof} />

            <div className="flex items-center justify-between gap-3 pt-2">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className="min-h-12 rounded-xl px-5 text-[0.9375rem] font-semibold text-ink/70 hover:bg-ink/5">
                  ← Atrás
                </button>
              ) : (
                <span />
              )}
              {step < steps.length - 1 && (
                <button type="button" onClick={() => go(step + 1)} className="min-h-12 rounded-xl bg-ink px-6 text-[0.9375rem] font-bold text-white transition hover:bg-brand">
                  Siguiente: {steps[step + 1]!.title} →
                </button>
              )}
            </div>
          </main>
        </div>

        {/* Vista previa */}
        <PreviewPanel
          iframeRef={iframe}
          device={device}
          setDevice={setDevice}
          hiddenOnMobile={mobileView === "edit"}
        />
      </div>

      {/* Pestañas en el celular */}
      <nav aria-label="Cambiar vista" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 lg:hidden">
        {(["edit", "preview"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={mobileView === v}
            onClick={() => setMobileView(v)}
            className={`min-h-12 rounded-xl text-[0.9375rem] font-bold transition ${mobileView === v ? "bg-ink text-white" : "text-ink/60"}`}
          >
            {v === "edit" ? "Editar" : "Ver mi portfolio"}
          </button>
        ))}
      </nav>
    </div>
  );
}

function PreviewPanel({
  iframeRef,
  device,
  setDevice,
  hiddenOnMobile,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  device: "mobile" | "desktop";
  setDevice: (d: "mobile" | "desktop") => void;
  hiddenOnMobile: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // En el celular la vista previa ocupa toda la pantalla, sin escalar.
  const isSmallScreen = size.w < 500;
  const frameW = isSmallScreen ? size.w : device === "desktop" ? 1280 : 390;
  const scale = isSmallScreen ? 1 : Math.min(1, (size.w - 32) / frameW);
  const frameH = isSmallScreen ? size.h : (size.h - 32) / scale;

  return (
    <section
      aria-label="Vista previa de tu portfolio"
      className={`flex min-h-0 flex-1 flex-col bg-[#ece8f3] ${hiddenOnMobile ? "hidden lg:flex" : "flex h-[calc(100dvh-4rem-4.5rem)] lg:h-auto"}`}
    >
      <div className="hidden items-center justify-between gap-3 px-4 pt-3 sm:flex">
        <p className="text-[0.8125rem] font-semibold text-ink/60">
          Vista previa en vivo · <span className="font-normal">pasa el cursor sobre una sección y toca «Editar»</span>
        </p>
        <div role="group" aria-label="Ver como" className="flex rounded-full bg-white p-1 shadow-sm">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
              className={`min-h-9 rounded-full px-4 text-[0.8125rem] font-semibold transition ${device === d ? "bg-ink text-white" : "text-ink/60"}`}
            >
              {d === "desktop" ? "Computadora" : "Celular"}
            </button>
          ))}
        </div>
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 origin-top overflow-hidden bg-white shadow-xl sm:top-4 sm:rounded-2xl"
          style={{ width: frameW, height: frameH, transform: `translateX(-50%) scale(${scale})` }}
        >
          <iframe ref={iframeRef} src={`${BASE}preview.html`} title="Vista previa de tu portfolio" className="h-full w-full border-0" />
        </div>
      </div>
    </section>
  );
}
