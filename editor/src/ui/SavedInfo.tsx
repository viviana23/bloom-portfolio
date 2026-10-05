import { useEffect, useRef, useState } from "react";

/**
 * Indicador "✓ Guardado" que, al tocarlo, explica en palabras simples
 * dónde queda guardado el trabajo y por qué conviene guardar la carpeta descargada.
 */
export function SavedInfo({ saved, onGoToDownload }: { saved: boolean; onGoToDownload: () => void }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="saved-info"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
      >
        <span aria-live="polite">{saved ? "✓ Guardado" : "Guardando…"}</span>
        <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-ink/25 text-[0.6875rem] font-bold">
          ?
        </span>
        <span className="sr-only">¿Dónde se guarda mi trabajo?</span>
      </button>
      {open && (
        <div
          id="saved-info"
          role="dialog"
          aria-label="Dónde se guarda tu trabajo"
          className="absolute right-0 top-full z-30 mt-2 w-[min(92vw,24rem)] rounded-2xl border border-line bg-white p-5 text-[0.875rem] leading-relaxed text-ink/80 shadow-xl"
        >
          <p className="text-[0.9375rem] font-bold text-ink">¿Dónde queda guardado mi trabajo?</p>
          <p className="mt-2">
            Mientras editas, todo se guarda solo <strong>en esta computadora y en este navegador</strong>. Puedes cerrar la pestaña o apagar el equipo: al volver, todo sigue ahí.
          </p>
          <p className="mt-3 font-semibold text-ink">No lo vas a encontrar si:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>entras desde otra computadora o desde el celular,</li>
            <li>usas otro navegador (por ejemplo, Safari en vez de Chrome),</li>
            <li>editas en una ventana privada o de incógnito,</li>
            <li>borras el historial o los datos de navegación.</li>
          </ul>
          <p className="mt-3 rounded-xl bg-brand/[0.07] px-3 py-2.5">
            <strong className="text-brand">Tu copia de seguridad es la carpeta que descargas.</strong> Guárdala en un lugar seguro, como Google Drive. Con ella puedes seguir editando desde cualquier computadora con «Abrir un portfolio descargado».
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onGoToDownload();
            }}
            className="mt-4 min-h-11 w-full rounded-xl bg-ink text-[0.875rem] font-bold text-white transition hover:bg-brand"
          >
            Ir a descargar mi copia
          </button>
        </div>
      )}
    </div>
  );
}
