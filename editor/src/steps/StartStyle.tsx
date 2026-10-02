import { useRef } from "react";
import { palettes, paletteNames, styles, type PaletteName, type StyleName } from "../../../src/lib/themes";
import type { PortfolioConfig, SectionId } from "../../../src/lib/types";
import { professions } from "../professions";
import { Card, Tip } from "../ui/fields";
import type { StepProps } from "./shared";

export function StartStep({ editor }: StepProps) {
  const current = editor.state!.professionId;
  const folder = useRef<HTMLInputElement>(null);

  /** Abrir la carpeta de un portfolio descargado antes (mi-portfolio.json + fotos). */
  const openFolder = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files];
    const json = list.find((f) => f.name === "mi-portfolio.json");
    if (!json) {
      alert('No encontramos el archivo "mi-portfolio.json" en esa carpeta. Elige la carpeta que descargaste del editor.');
      return;
    }
    try {
      const data = JSON.parse(await json.text()) as { config: PortfolioConfig };
      const photos = new Map<string, Blob>();
      for (const f of list) {
        const rel = (f as File & { webkitRelativePath: string }).webkitRelativePath;
        const m = rel.match(/(?:^|\/)fotos\/([^/]+\.jpg)$/i);
        if (m) photos.set(`/fotos/${m[1]}`, f);
      }
      await editor.importPortfolio(data.config, photos);
    } catch {
      alert("No pudimos abrir ese portfolio. ¿Es la carpeta que descargaste del editor?");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card title="¿A qué te dedicas?" description="Elegimos para ti el estilo, los colores y las secciones que mejor funcionan en tu oficio. Después puedes cambiar todo.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {professions.map((p) => {
            const active = current === p.id;
            const pal = palettes[p.palette].light;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    editor.chooseProfession(p);
                    editor.setStep(1);
                  }}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.9375rem] font-semibold transition ${
                    active ? "border-brand bg-brand/[0.08] text-ink" : "border-line bg-white text-ink hover:border-brand/50"
                  }`}
                >
                  <span aria-hidden="true" className="flex shrink-0 -space-x-1.5">
                    {[pal.accent, pal.blocks[0], pal.blocks[1]].map((c) => (
                      <span key={c} className="h-5 w-5 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </span>
                  {p.name}
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title="¿Ya tienes un portfolio de Bloom?" description="Si lo descargaste antes y quieres seguir editándolo en otro dispositivo, ábrelo aquí.">
        <button
          type="button"
          onClick={() => folder.current?.click()}
          className="min-h-12 rounded-xl border border-line bg-paper px-4 text-[0.9375rem] font-semibold text-ink transition hover:border-brand"
        >
          Abrir un portfolio descargado
        </button>
        <input
          ref={folder}
          type="file"
          hidden
          // @ts-expect-error: atributo estándar de los navegadores para elegir una carpeta
          webkitdirectory=""
          onChange={(e) => openFolder(e.target.files)}
        />
        <button
          type="button"
          onClick={() => confirm("¿Empezar de cero? Se borrará todo lo que llevas.") && editor.reset()}
          className="min-h-10 self-start text-[0.8125rem] font-semibold text-ink/50 hover:text-red-600"
        >
          Empezar de cero
        </button>
      </Card>
    </div>
  );
}

const styleInfo: Record<StyleName, { title: string; text: string }> = {
  divertido: { title: "Divertido", text: "Alegre y cercano: bordes marcados, stickers y color." },
  elegante: { title: "Elegante", text: "Sofisticado: líneas finas y letra clásica." },
  minimal: { title: "Minimal", text: "Sobrio y limpio: sin adornos, muy profesional." },
};

const paletteInfo: Record<PaletteName, string> = {
  fresa: "Fresa",
  salvia: "Salvia",
  arena: "Arena",
  lavanda: "Lavanda",
  tinta: "Tinta",
};

export const sectionNames: Record<SectionId, string> = {
  projects: "Proyectos destacados",
  gallery: "Galería",
  about: "Sobre mí",
  services: "Servicios",
  testimonials: "Testimonios",
  skills: "Habilidades",
  lab: "En proceso",
  experience: "Experiencia",
  education: "Formación",
  contact: "Contacto",
};

export function StyleStep({ editor }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  const style = c.theme.style ?? "divertido";
  const palette = c.theme.palette ?? "fresa";
  const order = Object.keys(c.sections) as SectionId[];

  const move = (i: number, dir: -1 | 1) =>
    update((d) => {
      const keys = Object.keys(d.sections) as SectionId[];
      const [k] = keys.splice(i, 1);
      keys.splice(i + dir, 0, k!);
      d.sections = Object.fromEntries(keys.map((key) => [key, d.sections[key]]));
    });

  return (
    <div className="flex flex-col gap-5">
      <Card title="Estilo" description="El carácter de tu portfolio.">
        <div className="grid gap-2 sm:grid-cols-3">
          {styles.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={style === s}
              onClick={() => update((d) => void (d.theme.style = s))}
              className={`rounded-xl border p-4 text-left transition ${style === s ? "border-brand bg-brand/[0.08]" : "border-line bg-white hover:border-brand/50"}`}
            >
              <span className="block text-[0.9375rem] font-bold text-ink">{styleInfo[s].title}</span>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-ink/60">{styleInfo[s].text}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Colores" description="Cada paleta trae su versión clara y oscura.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {paletteNames.map((p) => {
            const pal = palettes[p].light;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={palette === p}
                onClick={() => update((d) => void ((d.theme.palette = p), (d.theme.light = undefined), (d.theme.dark = undefined)))}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${palette === p ? "border-brand bg-brand/[0.08]" : "border-line bg-white hover:border-brand/50"}`}
              >
                <span aria-hidden="true" className="flex -space-x-1.5">
                  {[pal.accent, ...pal.blocks.slice(0, 3)].map((col) => (
                    <span key={col} className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ background: col }} />
                  ))}
                </span>
                <span className="text-[0.875rem] font-semibold text-ink">{paletteInfo[p]}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center justify-between gap-4 rounded-xl bg-paper px-4 py-3">
          <span>
            <span className="block text-[0.9375rem] font-semibold text-ink">¿Tienes un color de marca?</span>
            <span className="block text-[0.8125rem] text-ink/55">Cambia solo el color principal (botones y palabras destacadas).</span>
          </span>
          <input
            type="color"
            value={c.theme.light?.accent ?? palettes[palette].light.accent}
            onChange={(e) => update((d) => void (d.theme.light = { ...d.theme.light, accent: e.target.value }))}
            className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-white"
            aria-label="Elegir mi color de marca"
          />
        </label>
        {c.theme.light?.accent && (
          <button type="button" onClick={() => update((d) => void (d.theme.light = undefined))} className="self-start text-[0.8125rem] font-semibold text-ink/55 hover:text-ink">
            Volver al color de la paleta
          </button>
        )}
      </Card>

      <Card title="Orden de las secciones" description="Sube o baja cada sección. Las que están ocultas no se ven en tu portfolio.">
        <ol className="flex flex-col gap-2">
          {order.map((id, i) => (
            <li key={id} className="flex items-center gap-2 rounded-xl border border-line bg-paper py-1 pl-4 pr-1">
              <span className={`flex-1 text-[0.9375rem] font-semibold ${c.sections[id] ? "text-ink" : "text-ink/40 line-through"}`}>{sectionNames[id]}</span>
              <button
                type="button"
                onClick={() => update((d) => void (d.sections[id] = !d.sections[id]))}
                className="min-h-10 rounded-lg px-3 text-[0.8125rem] font-semibold text-brand hover:bg-brand/10"
              >
                {c.sections[id] ? "Ocultar" : "Mostrar"}
              </button>
              <button type="button" aria-label={`Subir ${sectionNames[id]}`} disabled={i === 0} onClick={() => move(i, -1)} className="grid h-10 w-10 place-items-center rounded-lg text-ink/60 hover:bg-ink/5 disabled:opacity-25">↑</button>
              <button type="button" aria-label={`Bajar ${sectionNames[id]}`} disabled={i === order.length - 1} onClick={() => move(i, 1)} className="grid h-10 w-10 place-items-center rounded-lg text-ink/60 hover:bg-ink/5 disabled:opacity-25">↓</button>
            </li>
          ))}
        </ol>
        <Tip>En la computadora, el menú muestra las 4 primeras secciones; el resto queda en "Más".</Tip>
      </Card>
    </div>
  );
}
