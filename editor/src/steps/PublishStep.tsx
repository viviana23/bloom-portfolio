import { useState } from "react";
import { slugify } from "../../../src/lib/content";
import { validateConfig } from "../../../src/lib/site";
import { buildPortfolioZip, downloadBlob } from "../export";
import { cleanConfig, usedImages } from "../finalize";
import { Card, Field, Tip } from "../ui/fields";
import type { StepProps } from "./shared";

type Check = { ok: boolean; required?: boolean; text: string; fix: string };

export function PublishStep({ editor, ctx }: StepProps) {
  const c = editor.state!.config;
  const [progress, setProgress] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const final = cleanConfig(c);
  const { errors } = validateConfig(final, { imageExists: (src) => ctx.images.has(src), where: "el editor" });
  const photos = usedImages(final);

  const checks: Check[] = [
    { ok: Boolean(c.person.name.trim()), required: true, text: "Tu nombre", fix: "Escríbelo en el paso «Sobre ti»." },
    { ok: Boolean(c.person.headline.trim()), text: "Tu frase principal", fix: "Agrégala en «Sobre ti»: es lo primero que leen." },
    { ok: Boolean(c.person.photo?.src), text: "Tu foto principal", fix: "Un portfolio con foto genera más confianza." },
    { ok: Boolean(final.person.whatsapp || final.person.email), text: "Tu WhatsApp o tu correo", fix: "Agrégalo en «Contacto» para que puedan escribirte." },
    {
      ok: Boolean(final.projects?.items.length || final.gallery?.items.length || final.services?.items.length),
      text: "Al menos un proyecto, foto o servicio",
      fix: "Muestra tu trabajo en «Tu trabajo» o «Lo que ofreces».",
    },
    { ok: final.links.length > 0, text: "Tus redes", fix: "Agrega al menos una en «Contacto»." },
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
      <Card title="Revisión final" description="Un repaso rápido antes de publicar.">
        <ul className="flex flex-col gap-2">
          {checks.map((k) => (
            <li key={k.text} className="flex gap-3 rounded-xl bg-paper px-4 py-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold ${
                  k.ok ? "bg-emerald-500 text-white" : k.required ? "bg-red-500 text-white" : "bg-amber-400 text-ink"
                }`}
              >
                {k.ok ? "✓" : "!"}
              </span>
              <span>
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {k.text}
                  <span className="sr-only">{k.ok ? ": listo" : k.required ? ": falta (obligatorio)" : ": recomendado"}</span>
                </span>
                {!k.ok && <span className="block text-[0.8125rem] text-ink/60">{k.fix}</span>}
              </span>
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
            ¡Listo! Revisa tu carpeta de Descargas y sigue los 3 pasos de abajo.
          </p>
        )}
      </Card>

      <Card title="Publícalo gratis en 3 pasos">
        <ol className="flex flex-col gap-4">
          <li className="flex gap-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-bold text-white">1</span>
            <span className="text-[0.9375rem] leading-relaxed text-ink">
              <strong>Descomprime la carpeta.</strong> En tu carpeta de Descargas, haz doble clic en <em>mi-portfolio….zip</em>. Aparece una carpeta con el mismo nombre.
            </span>
          </li>
          <li className="flex gap-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-bold text-white">2</span>
            <span className="text-[0.9375rem] leading-relaxed text-ink">
              <strong>Crea tu cuenta gratis en Netlify</strong> con tu correo o con Google. Es el servicio que pone tu portfolio en internet.
            </span>
          </li>
          <li className="flex gap-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-bold text-white">3</span>
            <span className="text-[0.9375rem] leading-relaxed text-ink">
              <strong>Arrastra la carpeta</strong> a la página de Netlify Drop. En unos segundos te da la dirección de tu portfolio. ¡Ya está publicado!
            </span>
          </li>
        </ol>
        <a
          href="https://app.netlify.com/drop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 text-[0.9375rem] font-bold text-ink transition hover:bg-ink hover:text-white"
        >
          Abrir Netlify Drop ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <Tip>
          Para <strong>actualizar</strong> tu portfolio: vuelve a este editor (tu avance queda guardado), haz tus cambios, descarga de nuevo y en Netlify entra a tu sitio → <em>Deploys</em> y arrastra la carpeta nueva.
        </Tip>
      </Card>

      <Card title="¿Ya tienes la dirección de tu portfolio?" description="Opcional. Ayuda a que Google y las redes muestren bien tu enlace. Después de escribirla, descarga y publica otra vez.">
        <Field
          label="Dirección de tu portfolio"
          type="url"
          value={c.site.url}
          onChange={(v) => editor.update((d) => void (d.site.url = v.trim()))}
          placeholder="https://tu-nombre.netlify.app"
          error={c.site.url && !/^https:\/\/[^/\s]+\.[^/\s]+/.test(c.site.url) ? 'Debe empezar por "https://".' : undefined}
        />
      </Card>
    </div>
  );
}
