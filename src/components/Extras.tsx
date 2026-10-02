import { useEffect, useRef, useState } from "react";
import { responsive } from "../lib/images";
import { useContent } from "../lib/content";
import { ArrowLeft, ArrowRight, Check, Close, Sparkle } from "./Icons";
import { Section, SmartLink } from "./primitives";

const blockStyle = (n: number) => ({ background: `var(--block-${n})`, color: `var(--on-block-${n})` });

/* ── Galería: mosaico bento + visor ───────────────────────────── */

// Patrón de 7 fotos que llena exactamente la retícula (2 columnas en móvil, 4 en escritorio).
const pattern = ["col-span-2 row-span-2", "row-span-2", "", "", "col-span-2", "", ""];

/** Tamaño de cada foto: el patrón se repite y las sobrantes se reparten sin dejar huecos. */
function spanFor(i: number, total: number): string {
  const full = Math.floor(total / pattern.length) * pattern.length;
  if (i < full) return pattern[i % pattern.length]!;
  const rest = total - full;
  const lastOdd = rest % 2 === 1 && i === total - 1;
  return lastOdd ? "col-span-2 md:col-span-4" : "col-span-2";
}

export function Gallery() {
  const { config, labels } = useContent();
  const gallery = config.gallery!;
  const items = gallery.items;
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const go = (step: number) => setOpen((i) => (i === null ? i : (i + step + items.length) % items.length));
  const current = open !== null ? items[open] : undefined;

  return (
    <Section id="gallery" title={gallery.title ?? labels.titleGallery} intro={gallery.intro}>
      <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[14rem]">
        {items.map((img, i) => (
          <li key={img.src} className={spanFor(i, items.length)}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${labels.openPhoto}: ${img.alt}`}
              className="group relative block h-full w-full overflow-hidden rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-surface md:rounded-[calc(1.5rem*var(--round))]"
            >
              <img
                src={img.src}
                {...responsive(img.src, "(min-width: 768px) 50vw, 100vw")}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ objectPosition: img.focus ?? "center" }}
                className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
              />
              {img.caption && (
                <span
                  className="chip absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate border-[length:var(--bw)] border-[color:var(--line)] shadow-[var(--pop)]"
                  style={blockStyle((i % 4) + 1)}
                >
                  {img.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current?.caption ?? current?.alt}
        className="project-dialog !bg-fg !text-bg"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
              <p className="text-[0.875rem] font-semibold opacity-80">
                {open! + 1} / {items.length}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label={labels.close}
                title={labels.close}
                className="grid h-11 w-11 place-items-center rounded-full border-[length:var(--bw)] border-bg"
              >
                <Close className="text-xl" />
              </button>
            </div>
            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-4 md:px-20">
              <img
                key={current.src}
                src={current.src}
                {...responsive(current.src, "100vw")}
                alt={current.alt}
                className="max-h-full min-h-0 w-auto max-w-full rounded-[calc(1.25rem*var(--round))] object-contain"
              />
              {current.caption && <figcaption className="text-title text-xl italic">{current.caption}</figcaption>}
            </figure>
            <div className="flex items-center justify-center gap-3 pb-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previousPhoto}
                className="grid h-12 w-12 place-items-center rounded-full bg-bg text-fg transition-transform hover:-translate-x-0.5"
              >
                <ArrowLeft className="text-xl" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.nextPhoto}
                className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-fg transition-transform hover:translate-x-0.5"
              >
                <ArrowRight className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </Section>
  );
}

/* ── Servicios / encargos ─────────────────────────────────────── */
export function Services() {
  const { config, contactLink, labels } = useContent();
  const services = config.services!;
  return (
    <Section id="services" title={services.title ?? labels.titleServices} intro={services.intro} band={2}>
      <ul className={`grid gap-5 md:gap-6 ${services.items.length >= 3 ? "lg:grid-cols-3" : services.items.length === 2 ? "md:grid-cols-2" : ""}`}>
        {services.items.map((s) => {
          const auto = contactLink(s.name);
          const cta = s.cta ?? (auto && { ...auto, label: labels.askService });
          return (
            <li
              key={s.name}
              className={`relative flex flex-col gap-6 rounded-[calc(1.75rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] p-7 shadow-[var(--pop)] md:p-8 ${
                s.featured ? "bg-fg text-bg" : "bg-bg text-fg"
              }`}
            >
              {s.featured && (
                <span
                  className="sticker absolute -top-5 right-6 rotate-[calc(5deg*var(--tilt))]"
                  style={blockStyle(3)}
                >
                  <Sparkle aria-hidden="true" /> {labels.featured}
                </span>
              )}
              <div>
                <h3 className="text-title text-[1.75rem] leading-tight md:text-[2rem]">{s.name}</h3>
                <p className={`mt-3 text-[0.9375rem] leading-relaxed ${s.featured ? "opacity-80" : "text-muted"}`}>
                  {s.description}
                </p>
              </div>
              {s.details && s.details.length > 0 && (
                <ul className="flex flex-col gap-2.5">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                      <Check className={`mt-0.5 shrink-0 ${s.featured ? "text-block-1" : "text-accent"}`} />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t-[length:var(--bw)] border-current/10 pt-6">
                {s.price && <p className="text-title text-[1.375rem]">{s.price}</p>}
                {cta && (
                  <SmartLink
                    link={cta}
                    showArrow={false}
                    className={`btn min-h-11 px-5 text-[0.875rem] ${s.featured ? "btn-primary !border-bg !shadow-none" : "btn-primary"}`}
                  >
                    {cta.label}
                    <ArrowRight />
                  </SmartLink>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ── Testimonios ──────────────────────────────────────────────── */
export function Testimonials() {
  const { config, labels } = useContent();
  const t = config.testimonials!;
  return (
    <Section id="testimonials" title={t.title ?? labels.titleTestimonials}>
      <ul className={`grid gap-5 md:gap-6 ${t.items.length >= 3 ? "lg:grid-cols-3" : t.items.length === 2 ? "md:grid-cols-2" : ""}`}>
        {t.items.map((item, i) => (
          <li key={item.name + i}>
            <figure className="tile flex h-full flex-col gap-6 border-[length:var(--bw)] border-[color:var(--line)] p-7 md:p-8" style={blockStyle((i % 4) + 1)}>
              <span aria-hidden="true" className="font-serif text-[4.5rem] leading-[0.6] italic">
                “
              </span>
              <blockquote className="text-title flex-1 text-[1.375rem] leading-snug md:text-[1.5rem]">
                {item.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t-[length:var(--bw)] border-current/15 pt-5">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-bg font-serif italic text-fg"
                >
                  {item.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold">{item.name}</span>
                  {item.context && <span className="block text-[0.8125rem] opacity-75">{item.context}</span>}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
