import { Fragment, type CSSProperties, type ReactNode } from "react";
import { isExternal, sectionAnchor, useContent } from "../lib/content";
import type { Link, SectionId } from "../lib/types";
import { useReveal } from "../lib/hooks";
import { ArrowUpRight, Sparkle } from "./Icons";

/** Convierte *texto* en énfasis (cursiva en color de acento). */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/** Enlace que abre en pestaña nueva si es externo, y lo anuncia. */
export function SmartLink({
  link,
  className,
  children,
  showArrow = true,
}: {
  link: Link;
  className?: string;
  children?: ReactNode;
  showArrow?: boolean;
}) {
  const { labels } = useContent();
  const external = isExternal(link.url);
  return (
    <a
      href={link.url}
      className={className}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children ?? link.label}
      {external && (
        <>
          {showArrow && <ArrowUpRight className="shrink-0 text-[0.9em] opacity-60" />}
          <span className="sr-only"> {labels.opensInNewTab}</span>
        </>
      )}
    </a>
  );
}

export type Band = 1 | 2 | 3 | 4 | "ink";

/** Colores de una banda: fondo sólido + texto legible. */
export function bandStyle(band?: Band): CSSProperties | undefined {
  if (!band) return undefined;
  if (band === "ink") return { background: "var(--fg)", color: "var(--bg)" };
  return { background: `var(--block-${band})`, color: `var(--on-block-${band})` };
}

/**
 * Contenedor de sección: etiqueta numerada, título grande e intro.
 * Con `band`, la sección entera se pinta de un color sólido (color blocking).
 */
export function Section({
  id,
  title,
  intro,
  children,
  band,
  revealContent = true,
}: {
  id: SectionId;
  title: string;
  intro?: string;
  children: ReactNode;
  band?: Band;
  /** false si el contenido anima sus propios elementos. */
  revealContent?: boolean;
}) {
  const { sectionNumber, isPro } = useContent();
  // En el estilo profesional no hay bandas de color: todas las secciones van sobre el fondo.
  if (isPro) band = undefined;
  const headerRef = useReveal<HTMLElement>();
  const contentRef = useReveal<HTMLDivElement>();
  const headingId = `${sectionAnchor[id]}-titulo`;
  const inner = (
    <div className="container-page">
      <header ref={headerRef} className="reveal grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
        <div className="md:col-span-7">
          <p
            aria-hidden="true"
            className={`bloom-section-number chip mb-5 border-[length:var(--bw)] border-[color:var(--line-current)] ${band ? "" : "text-fg"}`}
          >
            <Sparkle className={`text-[0.7rem] ${band === "ink" ? "text-block-1" : "text-accent"}`} />
            {sectionNumber(id)}
          </p>
          <h2
            id={headingId}
            className={`bloom-section-title text-title text-[2.5rem] leading-[1] md:text-[3.75rem] ${band ? "on-color" : ""}`}
          >
            <Rich text={title} />
          </h2>
        </div>
        {intro && (
          <p className={`max-w-md text-[1.0625rem] leading-relaxed md:col-span-5 ${band ? "opacity-80" : "text-muted"}`}>
            {intro}
          </p>
        )}
      </header>
      <div
        ref={revealContent ? contentRef : undefined}
        className={`mt-10 md:mt-14 ${revealContent ? "reveal [--reveal-delay:90ms]" : ""}`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <section id={sectionAnchor[id]} aria-labelledby={headingId} className={band ? "px-2 py-3 md:px-4" : ""}>
      {band ? (
        <div className="rounded-[calc(2rem*var(--round))] py-16 md:rounded-[calc(3rem*var(--round))] md:py-24" style={bandStyle(band)}>
          {inner}
        </div>
      ) : (
        <div className="py-16 md:py-24">{inner}</div>
      )}
    </section>
  );
}

/** Lista de enlaces sociales en línea, separados con elegancia. */
export function SocialLinks({ links, className = "" }: { links: Link[]; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-0 ${className}`}>
      {links.map((l) => (
        <li key={l.url + l.label}>
          <SmartLink link={l} className="inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-medium">
            <span className="link-underline">{l.label}</span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
