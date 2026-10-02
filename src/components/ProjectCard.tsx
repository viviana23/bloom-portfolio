import { useContent, type ResolvedProject } from "../lib/content";
import { responsive } from "../lib/images";
import { useReveal } from "../lib/hooks";
import { ArrowUpRight } from "./Icons";

export function ProjectCard({
  project,
  index,
  wide,
}: {
  project: ResolvedProject;
  index: number;
  wide: boolean;
}) {
  const { labels } = useContent();
  const ref = useReveal<HTMLElement>();
  const block = (index % 4) + 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={ref}
      className={`reveal tile tile-pop group relative flex flex-col gap-5 border-[length:var(--bw)] border-[color:var(--line)] p-3 md:p-4 ${
        wide ? "md:col-span-2 md:grid md:grid-cols-12 md:items-stretch md:gap-8" : ""
      }`}
      style={{
        background: `var(--block-${block})`,
        color: `var(--on-block-${block})`,
        ["--reveal-delay" as string]: `${(index % 2) * 90}ms`,
      }}
    >
      <div
        className={`relative overflow-hidden rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-bg ${
          wide ? "aspect-[4/3] md:col-span-7 md:aspect-auto md:min-h-[26rem]" : "aspect-[4/3]"
        }`}
      >
        {project.cover ? (
          <img
            src={project.cover.src}
                {...responsive(project.cover.src, "(min-width: 1280px) 760px, (min-width: 768px) 50vw, 100vw")}
            alt={project.cover.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            width={1600}
            height={1200}
            style={{ objectPosition: project.cover.focus ?? "center" }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden="true" className="grid h-full w-full place-items-center">
            <span className="text-display text-[clamp(5rem,14vw,9rem)] italic text-accent">{number}</span>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col px-2 pb-2 md:px-3 ${wide ? "md:col-span-5 md:justify-center md:py-6" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-bg text-fg">{number}</span>
          {project.type && <span className="chip border-[length:var(--bw)] border-[color:var(--line-current)]">{project.type}</span>}
          {project.year && <span className="chip border-[length:var(--bw)] border-[color:var(--line-current)]">{project.year}</span>}
        </div>
        <h3 className={`text-title mt-5 leading-[1.05] ${wide ? "text-[2rem] md:text-[2.75rem]" : "text-[1.875rem] md:text-[2.125rem]"}`}>
          <a
            href={`#proyecto/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-[calc(1.75rem*var(--round))] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {project.title}
          </a>
        </h3>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed opacity-80 md:text-base">{project.summary}</p>
        <p aria-hidden="true" className="mt-auto flex items-center gap-3 pt-6 text-[0.9375rem] font-semibold">
          <span className="grid h-11 w-11 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-bg text-fg transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="text-lg" />
          </span>
          {labels.viewProject}
        </p>
      </div>
    </article>
  );
}
