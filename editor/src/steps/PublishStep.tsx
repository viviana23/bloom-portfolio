import { useState } from "react";
import { createContent, slugify } from "../../../src/lib/content";
import { validateConfig } from "../../../src/lib/site";
import { buildPortfolioZip, downloadBlob } from "../export";
import { cleanConfig, usedImages } from "../finalize";
import { Card } from "../ui/fields";
import { sectionNames } from "./StartStyle";
import { STEP_FOR_SECTION, type StepProps } from "./shared";

type Check = { ok: boolean; required?: boolean; text: string; fix: string; step: number };

// Estos datos ya se revisan con la lista de abajo, en lenguaje claro.
const COVERED = /^Falta el campo (site\.|person\.)/;

export function PublishStep({ editor, ctx }: StepProps) {
  const c = editor.state!.config;
  const [progress, setProgress] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const final = cleanConfig(c);
  const errors = validateConfig(final, { imageExists: (src) => ctx.images.has(src), where: "el editor" }).errors.filter(
    (e) => !COVERED.test(e),
  );
  const { emptySections } = createContent(final);
  const photos = usedImages(final).filter((p) => p.startsWith("/fotos/"));

  const checks: Check[] = [
    { ok: Boolean(c.person.name.trim()), required: true, text: "Tu nombre", fix: "Es obligatorio: va en grande al inicio.", step: 1 },
    { ok: Boolean(c.person.headline.trim()), text: "Tu frase principal", fix: "Es lo primero que leen después de tu nombre.", step: 1 },
    { ok: Boolean(c.person.photo?.src), text: "Tu foto principal", fix: "Un portfolio con foto genera más confianza.", step: 1 },
    { ok: Boolean(final.person.whatsapp || final.person.email), text: "Tu WhatsApp o tu correo", fix: "Sin esto, no hay botones para que te escriban.", step: 5 },
    {
      ok: Boolean(final.projects?.items.length || final.gallery?.items.length || final.services?.items.length),
      text: "Al menos un proyecto, foto o servicio",
      fix: "Muestra tu trabajo: es lo que más convence.",
      step: 2,
    },
    { ok: final.links.length > 0, text: "Tus redes", fix: "Agrega al menos una para que te sigan.", step: 5 },
  ];
  const blocking = checks.some((k) => k.required && !k.ok) || errors.length > 0;

  const download = async () => {
    setDone(false);
    try {
      setProgress("Empezando…");
      const zip = await buildPortfolioZip(final, ctx.images, setProgress);
      downloadBlob(zip, `mi-portfolio-${slugify(final.person.name) || "bloom"}.zip`);
      setDone(true);
    } catch (e) {
      console.error(e);
      alert("Algo salió mal al preparar tu portfolio. Revisa tu conexión a internet e inténtalo de nuevo.");
    } finally {
      setProgress(null);
    }
  };


  return (
    <div className="flex flex-col gap-5">
      <Card title="Revisión final" description="Un repaso rápido antes de publicar. Toca «Completar» para ir directo a lo que falta.">
        <ul className="flex flex-col gap-2">
          {checks.map((k) => (
            <li key={k.text} className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3">
              <Status ok={k.ok} required={k.required} />
              <span className="flex-1">
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {k.text}
                  <span className="sr-only">{k.ok ? ": listo" : k.required ? ": falta (obligatorio)" : ": recomendado"}</span>
                </span>
                {!k.ok && <span className="block text-[0.8125rem] text-ink/60">{k.fix}</span>}
              </span>
              {!k.ok && <GoTo onClick={() => editor.setStep(k.step)} />}
            </li>
          ))}
          {emptySections.map((id) => (
            <li key={id} className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3">
              <Status ok={false} />
              <span className="flex-1">
                <span className="block text-[0.9375rem] font-semibold text-ink">«{sectionNames[id]}» está vacía</span>
                <span className="block text-[0.8125rem] text-ink/60">
                  Está activada, pero no se verá hasta que le agregues contenido en «{STEP_FOR_SECTION[id].name}».
                </span>
              </span>
              <GoTo onClick={() => editor.setStep(STEP_FOR_SECTION[id].step)} />
            </li>
          ))}
          {errors.map((e) => (
            <li key={e} className="rounded-xl bg-red-50 px-4 py-3 text-[0.875rem] text-red-700">
              {e}
            </li>
          ))}
        </ul>
        <p className="text-[0.8125rem] text-ink/55">
          {photos.length} {photos.length === 1 ? "foto" : "fotos"} en tu portfolio. Las optimizamos para que cargue rápido.
        </p>
      </Card>

      <Card title="Descarga tu portfolio" description="Se descarga una carpeta comprimida (.zip) con tu portfolio completo.">
        <button
          type="button"
          onClick={download}
          disabled={blocking || Boolean(progress)}
          className="min-h-14 rounded-2xl bg-brand px-6 text-[1.0625rem] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {progress ?? "Descargar mi portfolio"}
        </button>
        <p aria-live="polite" className="sr-only">
          {progress ?? (done ? "Tu portfolio se descargó." : "")}
        </p>
        {blocking && <p className="text-[0.875rem] font-semibold text-red-600">Completa lo marcado en rojo para poder descargar.</p>}
        {done && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[0.9375rem] font-semibold text-emerald-800">
            ¡Listo! Revisa tu carpeta de Descargas y sigue los pasos de abajo.
          </p>
        )}
      </Card>

      <Card title="Publícalo gratis en 3 pasos">
        <ol className="flex flex-col gap-4">
          <StepItem n={1}>
            <strong>Descomprime la carpeta.</strong> En tu carpeta de Descargas, haz doble clic en <em>mi-portfolio….zip</em>. Aparece una carpeta con el mismo nombre.
          </StepItem>
          <StepItem n={2}>
            <strong>Crea tu cuenta gratis en Netlify</strong> con tu correo o con Google. Es el servicio que pone tu portfolio en internet.
          </StepItem>
          <StepItem n={3}>
            <strong>Arrastra la carpeta</strong> a la página de Netlify Drop. En unos segundos te da la dirección de tu portfolio. ¡Ya está publicado!
          </StepItem>
        </ol>
        <a
          href="https://app.netlify.com/drop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 text-[0.9375rem] font-bold text-ink transition hover:bg-ink hover:text-white"
        >
          Abrir Netlify Drop ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <div className="rounded-xl bg-brand/[0.07] px-4 py-3 text-[0.875rem] leading-relaxed text-ink/75">
          <p className="font-semibold text-brand">¿Cómo cambio mi portfolio después de publicarlo?</p>
          <p className="mt-1">
            Las veces que quieras. Entra de nuevo al editor: tus textos y fotos siguen ahí, guardados en tu navegador. Haz tus cambios y descarga tu portfolio otra vez. Luego, en Netlify, abre tu sitio, ve a <strong>Deploys</strong> y arrastra la carpeta nueva. Tu portfolio se actualiza y conserva la misma dirección.
          </p>
          <p className="mt-2">
            <strong>Importante:</strong> arrástrala en <em>Deploys</em> de tu sitio, no en la página de Netlify Drop; ahí se crearía un sitio nuevo con otra dirección.
          </p>
          <p className="mt-2">
            <strong>Guarda la carpeta descargada</strong> en un lugar seguro, como Google Drive: es tu copia de seguridad. Tu avance queda guardado solo en esta computadora y en este navegador; si entras desde otro equipo, otro navegador o una ventana de incógnito, o si borras el historial, abre esa carpeta con «Abrir un portfolio descargado» en el primer paso.
          </p>
        </div>
      </Card>

    </div>
  );
}

function Status({ ok, required }: { ok: boolean; required?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold ${
        ok ? "bg-emerald-500 text-white" : required ? "bg-red-500 text-white" : "bg-amber-400 text-ink"
      }`}
    >
      {ok ? "✓" : "!"}
    </span>
  );
}

function GoTo({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-10 shrink-0 rounded-lg bg-white px-3 text-[0.8125rem] font-bold text-brand shadow-sm transition hover:bg-brand hover:text-white"
    >
      Completar →
    </button>
  );
}

function StepItem({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-bold text-white">
        {n}
      </span>
      <span className="text-[0.9375rem] leading-relaxed text-ink">{children}</span>
    </li>
  );
}
