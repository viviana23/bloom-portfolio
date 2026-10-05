import { useRef, useState } from "react";
import type { Certification, EducationItem, ExperienceItem, LabItem, PortfolioConfig, Project } from "../../../src/lib/types";

type Service = NonNullable<PortfolioConfig["services"]>["items"][number];
type Testimonial = NonNullable<PortfolioConfig["testimonials"]>["items"][number];
import { prepareUpload } from "../export";
import { newImagePath } from "../store";
import { Card, Field, ImagePicker, LinesField, ListEditor, TextArea, Tip, Toggle } from "../ui/fields";
import { sectionSwitch, type StepProps } from "./shared";

export function WorkStep({ editor, ctx }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  const projects = c.projects?.items ?? [];
  const gallery = c.gallery?.items ?? [];
  const pro = c.theme.style === "profesional";
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  const addGalleryPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files].slice(0, 24);
    setUploading(list.length);
    const added: { src: string; alt: string }[] = [];
    for (const file of list) {
      try {
        const blob = await prepareUpload(file);
        const path = newImagePath(file.name);
        await ctx.addImage(path, blob);
        added.push({ src: path, alt: "" });
      } catch {
        /* se omite la foto que no se pudo leer */
      }
      setUploading((n) => n - 1);
    }
    update((d) => void (d.gallery = { ...d.gallery, items: [...(d.gallery?.items ?? []), ...added] }));
  };

  return (
    <div className="flex flex-col gap-5">
      <Card
        id="card-proyectos"
        title="Proyectos destacados"
        description="Tus mejores trabajos, contados con su historia: el reto, lo que hiciste y el resultado. Con 1 a 3 es suficiente."
        {...sectionSwitch(editor, "projects")}
      >
        <ListEditor<Project>
          items={projects}
          onChange={(items) => update((d) => void (d.projects = { ...d.projects, items }))}
          create={() => ({ title: "", summary: "" })}
          addLabel="Agregar proyecto"
          itemTitle={(p) => p.title}
          render={(p, set) => (
            <>
              <Field label="Título" value={p.title} onChange={(v) => set((d) => void (d.title = v))} placeholder="Ej. Pastel de bodas con frutos rojos" />
              <TextArea label="Resumen corto" hint="Una o dos frases. Es lo que se ve en la tarjeta." value={p.summary} onChange={(v) => set((d) => void (d.summary = v))} rows={2} />
              <ImagePicker label="Foto principal" value={p.cover} onChange={(img) => set((d) => void (d.cover = img))} ctx={ctx} showFocus />
              <Field
                label="Herramientas o tecnologías (opcional)"
                hint="Sepáralas con comas. En el estilo Profesional se muestran como etiquetas."
                value={(p.tools ?? []).join(", ")}
                onChange={(v) => set((d) => void (d.tools = v.split(",").map((t) => t.trimStart())))}
                placeholder="Ej. React, Figma, Python, Canva"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo de trabajo" value={p.type} onChange={(v) => set((d) => void (d.type = v))} placeholder="Ej. Boda, Cliente, Personal" />
                <Field label="Año" value={p.year} onChange={(v) => set((d) => void (d.year = v))} placeholder="Ej. 2026" maxLength={9} />
              </div>
              <Tip>Lo de abajo es opcional, pero es lo que convence: cuenta la historia completa.</Tip>
              <TextArea label="¿Cuál era el reto o el encargo?" value={p.problem} onChange={(v) => set((d) => void (d.problem = v))} />
              <TextArea
                label="¿Qué hiciste y cómo?"
                value={Array.isArray(p.process) ? p.process.join("\n") : p.process}
                onChange={(v) => set((d) => void (d.process = v))}
              />
              <TextArea label="¿Cuál fue el resultado?" value={p.result} onChange={(v) => set((d) => void (d.result = v))} />
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((k) => (
                  <Field
                    key={k}
                    label={k === 0 ? "Enlace principal (opcional)" : "Otro enlace (opcional)"}
                    hint={k === 0 ? "Ej. la página publicada, la demo o el caso completo." : "Ej. el código en GitHub o un video."}
                    type="url"
                    value={p.links?.[k]?.url}
                    onChange={(v) =>
                      set((d) => {
                        const links = [...(d.links ?? [])];
                        const url = v.trim() && !/^https?:\/\//.test(v.trim()) ? `https://${v.trim()}` : v.trim();
                        links[k] = { label: /github\.com|gitlab\.com/.test(url) ? "Ver código" : k === 0 ? "Ver en línea" : "Ver más", url };
                        d.links = links.filter((l) => l && l.url);
                      })
                    }
                    placeholder={k === 0 ? "https://…" : "https://github.com/…"}
                  />
                ))}
              </div>
              <ImagePicker
                label="Otra foto del proyecto (opcional)"
                value={p.gallery?.[0]}
                onChange={(img) => set((d) => void (d.gallery = img ? [img] : []))}
                ctx={ctx}
              />
            </>
          )}
        />
      </Card>

      <Card
        id="card-galeria"
        title={pro ? "Galería (más trabajos)" : "Galería"}
        description={
          pro
            ? "Pantallas, piezas o visualizaciones que no necesitan un caso completo. Se ven en una cuadrícula ordenada con su título debajo."
            : "Tus mejores fotos en un mosaico. Puedes subir varias a la vez."
        }
        {...sectionSwitch(editor, "gallery")}
      >
        {gallery.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g, i) => (
              <li key={g.src} className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-2">
                <div
                  className={`${pro ? "aspect-[16/10] bg-top" : "aspect-square bg-center"} rounded-lg bg-ink/5 bg-cover`}
                  style={{ backgroundImage: ctx.urlFor(g.src) ? `url(${ctx.urlFor(g.src)})` : undefined }}
                  role="img"
                  aria-label={g.alt || "Foto de la galería"}
                />
                <input
                  aria-label={`Texto corto de la foto ${i + 1}`}
                  value={g.caption ?? ""}
                  onChange={(e) => update((d) => void (d.gallery!.items[i]!.caption = e.target.value))}
                  placeholder={pro ? "Título (ej. App de pagos)" : "Etiqueta (opcional)"}
                  className="min-h-10 rounded-lg border border-line px-2 text-[0.8125rem] outline-none focus:border-brand"
                />
                <input
                  aria-label={`Descripción de la foto ${i + 1}`}
                  value={g.alt}
                  onChange={(e) => update((d) => void (d.gallery!.items[i]!.alt = e.target.value))}
                  placeholder={pro ? "Qué es (ej. Pantalla de inicio en Figma)" : "¿Qué se ve?"}
                  className="min-h-10 rounded-lg border border-line px-2 text-[0.8125rem] outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => update((d) => void d.gallery!.items.splice(i, 1))}
                  className="min-h-9 text-[0.8125rem] font-semibold text-ink/50 hover:text-red-600"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading > 0}
          className="min-h-12 rounded-xl border-2 border-dashed border-brand/40 text-[0.9375rem] font-semibold text-brand transition hover:border-brand hover:bg-brand/5"
        >
          {uploading > 0 ? `Subiendo fotos… (faltan ${uploading})` : "+ Agregar fotos"}
        </button>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => addGalleryPhotos(e.target.files)} />
      </Card>
    </div>
  );
}

export function OfferStep({ editor }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  return (
    <div className="flex flex-col gap-5">
      <Card id="card-servicios" title="Servicios o productos" description="Lo que ofreces, con o sin precio. Cada uno tiene un botón para que te escriban." {...sectionSwitch(editor, "services")}>
        <ListEditor<Service>
          items={c.services?.items ?? []}
          onChange={(items) => update((d) => void (d.services = { ...d.services, items }))}
          create={() => ({ name: "", description: "" })}
          addLabel="Agregar servicio"
          itemTitle={(s) => s.name}
          max={6}
          render={(s, set) => (
            <>
              <Field label="Nombre" value={s.name} onChange={(v) => set((d) => void (d.name = v))} placeholder="Ej. Pasteles de celebración" />
              <TextArea label="Descripción" value={s.description} onChange={(v) => set((d) => void (d.description = v))} rows={2} />
              <Field label="Precio (opcional)" value={s.price} onChange={(v) => set((d) => void (d.price = v))} placeholder="Ej. Desde $180.000" />
              <LinesField label="¿Qué incluye? (opcional)" value={s.details} onChange={(v) => set((d) => void (d.details = v))} placeholder={"Degustación\nDiseño personalizado\nEntrega a domicilio"} />
              <Toggle checked={Boolean(s.featured)} onChange={(v) => set((d) => void (d.featured = v))} label="Destacar este servicio" description='Se muestra en oscuro con el sticker "El más pedido".' />
            </>
          )}
        />
      </Card>

      <Card id="card-testimonios" title="Testimonios" description="Comentarios de clientes. Usa solo comentarios reales y pide permiso antes de publicarlos." {...sectionSwitch(editor, "testimonials")}>
        <ListEditor<Testimonial>
          items={c.testimonials?.items ?? []}
          onChange={(items) => update((d) => void (d.testimonials = { ...d.testimonials, items }))}
          create={() => ({ quote: "", name: "" })}
          addLabel="Agregar testimonio"
          itemTitle={(t) => t.name}
          max={9}
          render={(t, set) => (
            <>
              <TextArea label="El comentario" value={t.quote} onChange={(v) => set((d) => void (d.quote = v))} placeholder="Ej. Todo quedó perfecto…" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" value={t.name} onChange={(v) => set((d) => void (d.name = v))} placeholder="Ej. Daniela R." />
                <Field label="¿Qué se le hizo? (opcional)" value={t.context} onChange={(v) => set((d) => void (d.context = v))} placeholder="Ej. Boda, 120 invitados" />
              </div>
            </>
          )}
        />
      </Card>
    </div>
  );
}

export function TrajectoryStep({ editor }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  return (
    <div className="flex flex-col gap-5">
      <Tip>Todo en este paso es opcional. Si estás empezando, "En proceso" es tu mejor aliada: muestra lo que aprendes y lo que buscas.</Tip>

      <Card id="card-laboratorio" title="En proceso" description="Lo que estás aprendiendo, probando y las oportunidades que buscas." {...sectionSwitch(editor, "lab")}>
        <TextArea
          label="¿Qué oportunidades buscas hoy?"
          hint="Se muestra destacado, con un botón para que te escriban."
          value={c.lab?.lookingFor}
          onChange={(v) => update((d) => void (d.lab = { items: [], ...d.lab, lookingFor: v }))}
          placeholder="Ej. Cafeterías que quieran ofrecer postres artesanales."
          rows={2}
        />
        <ListEditor<LabItem>
          items={c.lab?.items ?? []}
          onChange={(items) => update((d) => void (d.lab = { ...d.lab, items }))}
          create={() => ({ title: "", description: "", status: "En curso" })}
          addLabel="Agregar curso, reto o proyecto personal"
          itemTitle={(i) => i.title}
          max={9}
          render={(i, set) => (
            <>
              <Field label="Título" value={i.title} onChange={(v) => set((d) => void (d.title = v))} placeholder="Ej. Curso de chocolatería" />
              <TextArea label="Descripción" value={i.description} onChange={(v) => set((d) => void (d.description = v))} rows={2} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Tipo" value={i.kind} onChange={(v) => set((d) => void (d.kind = v))} placeholder="Ej. Curso" />
                <Field label="Estado" value={i.status} onChange={(v) => set((d) => void (d.status = v))} placeholder="En curso" />
                <Field label="Año" value={i.year} onChange={(v) => set((d) => void (d.year = v))} placeholder="2026" />
              </div>
            </>
          )}
        />
      </Card>

      <Card id="card-habilidades" title="Habilidades" description="Agrupadas por tema: técnicas, herramientas, idiomas…" {...sectionSwitch(editor, "skills")}>
        <ListEditor
          items={c.skills?.groups ?? []}
          onChange={(groups) => update((d) => void (d.skills = { ...d.skills, groups }))}
          create={() => ({ name: "", items: [] })}
          addLabel="Agregar grupo de habilidades"
          itemTitle={(g) => g.name}
          max={6}
          render={(g, set) => (
            <>
              <Field label="Nombre del grupo" value={g.name} onChange={(v) => set((d) => void (d.name = v))} placeholder="Ej. Técnicas" />
              <Field
                label="Habilidades"
                hint="Sepáralas con comas."
                value={g.items.join(", ")}
                onChange={(v) => set((d) => void (d.items = v.split(",").map((s) => s.trimStart())))}
                placeholder="Ej. Laminado, Merengue suizo, Chocolate"
              />
            </>
          )}
        />
      </Card>

      <Card id="card-experiencia" title="Experiencia" description="Trabajos anteriores o tu propio negocio." {...sectionSwitch(editor, "experience")}>
        <ListEditor<ExperienceItem>
          items={c.experience?.items ?? []}
          onChange={(items) => update((d) => void (d.experience = { ...d.experience, items }))}
          create={() => ({ role: "", company: "", period: "" })}
          addLabel="Agregar experiencia"
          itemTitle={(e) => [e.role, e.company].filter(Boolean).join(" · ")}
          max={8}
          render={(e, set) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Cargo" value={e.role} onChange={(v) => set((d) => void (d.role = v))} placeholder="Ej. Pastelera" />
                <Field label="Empresa o lugar" value={e.company} onChange={(v) => set((d) => void (d.company = v))} placeholder="Ej. Hotel Casa Almendro" />
              </div>
              <Field label="Fechas" value={e.period} onChange={(v) => set((d) => void (d.period = v))} placeholder="Ej. 2020 — 2024" />
              <TextArea label="¿Qué hacías? (opcional)" value={e.description} onChange={(v) => set((d) => void (d.description = v))} rows={2} />
              <LinesField label="Logros (opcional)" value={e.achievements} onChange={(v) => set((d) => void (d.achievements = v))} />
            </>
          )}
        />
      </Card>

      <Card id="card-formacion" title="Formación" description="Estudios, cursos y certificaciones." {...sectionSwitch(editor, "education")}>
        <ListEditor<EducationItem>
          items={c.education?.items ?? []}
          onChange={(items) => update((d) => void (d.education = { ...d.education, items }))}
          create={() => ({ program: "", institution: "" })}
          addLabel="Agregar estudio"
          itemTitle={(e) => e.program}
          max={8}
          render={(e, set) => (
            <>
              <Field label="Programa" value={e.program} onChange={(v) => set((d) => void (d.program = v))} placeholder="Ej. Técnica en Pastelería" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Institución" value={e.institution} onChange={(v) => set((d) => void (d.institution = v))} />
                <Field label="Fechas" value={e.period} onChange={(v) => set((d) => void (d.period = v))} placeholder="Ej. 2018 — 2020" />
              </div>
            </>
          )}
        />
        <ListEditor<Certification>
          items={c.education?.certifications ?? []}
          onChange={(certifications) => update((d) => void (d.education = { items: [], ...d.education, certifications }))}
          create={() => ({ name: "" })}
          addLabel="Agregar certificación"
          itemTitle={(e) => e.name}
          max={10}
          render={(e, set) => (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Nombre" value={e.name} onChange={(v) => set((d) => void (d.name = v))} />
              <Field label="Entidad" value={e.issuer} onChange={(v) => set((d) => void (d.issuer = v))} />
              <Field label="Año" value={e.year} onChange={(v) => set((d) => void (d.year = v))} />
            </div>
          )}
        />
      </Card>
    </div>
  );
}
