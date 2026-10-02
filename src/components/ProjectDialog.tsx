import { useEffect, useRef, type ReactNode } from "react";
import { responsive } from "../lib/images";
import { useContent, type ResolvedProject } from "../lib/content";
import { ArrowLeft, ArrowRight, Close } from "./Icons";
import { SmartLink } from "./primitives";

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 border-t-[length:var(--bw)] border-fg/10 pt-7 md:grid-cols-12 md:gap-8">
      <h3 className="md:col-span-3">
        <span className="chip bg-fg text-bg">{label}</span>
      </h3>
      <div className="text-[1.0625rem] leading-relaxed text-fg md:col-span-9 md:text-lg">{children}</div>
    </div>
  );
}

export function ProjectDialog({
  project,
  onClose,
  onNavigate,
}: {
  project: ResolvedProject | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const { labels, projects } = useContent();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
    if (project) {
      dialog.scrollTo({ top: 0 });
      // El foco va al título: el lector de pantalla anuncia el proyecto.
      dialog.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    }
  }, [project]);

  const index = project ? projects.findIndex((p) => p.slug === project.slug) : -1;
  const prev = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined;

  const facts = project
    ? [
        project.role && { label: labels.role, value: project.role },
        project.tools?.length && { label: labels.tools, value: project.tools.join(", ") },
        project.year && { label: labels.year, value: project.year },
      ].filter((f): f is { label: string; value: string } => Boolean(f))
    : [];

  const titleId = "proyecto-titulo";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="project-dialog is-panel overscroll-contain"
      onClose={() => project && onClose()}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {project && (
        <article className="min-h-full">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-[length:var(--bw)] border-[color:var(--line)] bg-block-1 px-5 py-3 text-on-block-1 md:px-10">
            <p className="truncate text-[0.875rem] font-semibold">{[project.type, project.year].filter(Boolean).join(" · ")}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label={labels.close}
              title={labels.close}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line-current)] bg-bg text-fg transition-transform hover:-translate-y-0.5"
            >
              <Close className="text-xl" />
            </button>
          </div>

          <div className="px-5 pb-12 pt-10 md:px-10 md:pb-16 md:pt-12">
            <header className="max-w-3xl">
              <h2 id={titleId} tabIndex={-1} className="outline-none text-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1]">
                {project.title}
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-muted md:text-[1.375rem]">{project.summary}</p>
            </header>

            {project.cover && (
              <img
                src={project.cover.src}
                {...responsive(project.cover.src, "(min-width: 768px) 900px, 100vw")}
                alt={project.cover.alt}
                width={1600}
                height={1000}
                className="mt-10 aspect-[16/10] w-full rounded-[calc(1.5rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-surface object-cover md:mt-12"
              />
            )}

            {facts.length > 0 && (
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {facts.map((f, i) => (
                  <div
                    key={f.label}
                    className="rounded-[calc(1.25rem*var(--round))] p-5"
                    style={{ background: `var(--block-${i + 2})`, color: `var(--on-block-${i + 2})` }}
                  >
                    <dt className="mb-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] opacity-75">{f.label}</dt>
                    <dd className="text-[0.9375rem] leading-relaxed">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {project.outcomes && project.outcomes.length > 0 && (
              <section aria-label={labels.outcomes} className="mt-3 grid gap-3 sm:grid-cols-2">
                {project.outcomes.map((o) => (
                  <div key={o.label} className="rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-accent p-6 text-accent-fg md:p-8">
                    <p className="text-display text-[2.75rem] md:text-[3.25rem]">{o.value}</p>
                    <p className="mt-2 text-[0.9375rem] font-medium opacity-90">{o.label}</p>
                  </div>
                ))}
              </section>
            )}

            <div className="mt-12 flex flex-col gap-10 md:mt-16">
              {project.problem && <Block label={labels.problem}>{project.problem}</Block>}
              {project.process && (
                <Block label={labels.process}>
                  {Array.isArray(project.process) ? (
                    <ol className="flex flex-col gap-4">
                      {project.process.map((step, i) => (
                        <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
                          <span className="pt-0.5 font-serif text-lg italic text-accent">{String(i + 1).padStart(2, "0")}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    project.process
                  )}
                </Block>
              )}
              {project.result && <Block label={labels.result}>{project.result}</Block>}
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                {...responsive(img.src, "(min-width: 640px) 450px, 100vw")}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-surface object-cover"
                  />
                ))}
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-3">
                {project.links.map((l, i) => (
                  <SmartLink key={l.url} link={l} className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"}`} />
                ))}
              </div>
            )}
          </div>

          {(prev || next) && (
            <nav
              aria-label={`${labels.previousProject} / ${labels.nextProject}`}
              className="grid grid-cols-2 border-t-[length:var(--bw)] border-[color:var(--line)]"
            >
              {[prev, next].map((p, i) =>
                p ? (
                  <a
                    key={p.slug}
                    href={`#proyecto/${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(p.slug);
                    }}
                    className={`group flex flex-col gap-2 px-5 py-7 transition-colors hover:bg-block-1 hover:text-on-block-1 md:px-10 md:py-9 ${
                      i === 1 ? "items-end border-l-[length:var(--bw)] border-[color:var(--line)] text-right" : ""
                    }`}
                  >
                    <span className="text-eyebrow inline-flex items-center gap-2">
                      {i === 0 && <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />}
                      {i === 0 ? labels.previousProject : labels.nextProject}
                      {i === 1 && <ArrowRight className="transition-transform group-hover:translate-x-0.5" />}
                    </span>
                    <span className="text-title text-lg md:text-2xl">{p.title}</span>
                  </a>
                ) : (
                  <span key={i} className={i === 1 ? "border-l-[length:var(--bw)] border-[color:var(--line)]" : ""} />
                ),
              )}
            </nav>
          )}
        </article>
      )}
    </dialog>
  );
}
