import type { CSSProperties } from "react";
import { responsive } from "../lib/images";
import { initials, useContent } from "../lib/content";
import { useState } from "react";
import { ArrowRight, Download, Pause, Play, Sparkle } from "./Icons";
import { Rich, SmartLink, SocialLinks } from "./primitives";

/** Sello circular con texto que gira. */
function Seal({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="decor pop-in absolute -bottom-5 -left-3 z-20 grid h-28 w-28 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-accent text-accent-fg shadow-[var(--pop)] [--d:500ms] md:-left-8 md:bottom-12 md:h-32 md:w-32"
    >
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full p-2">
        <defs>
          <path id="seal-circle" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text fill="currentColor" fontSize="8.6" fontWeight="600" letterSpacing="1.4" style={{ textTransform: "uppercase" }}>
          <textPath href="#seal-circle" textLength="228" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <Sparkle className="text-3xl" />
    </div>
  );
}

/** Stickers flotantes alrededor del arco. Decorativos: repiten las especialidades. */
const stickerSpots: { className: string; style: CSSProperties }[] = [
  { className: "right-[-0.5rem] top-[12%] md:right-[-1.75rem]", style: { background: "var(--block-3)", color: "var(--on-block-3)", ["--r" as string]: "6deg", transform: "rotate(calc(6deg * var(--tilt)))" } },
  { className: "left-[-0.75rem] top-[38%] md:left-[-2.5rem]", style: { background: "var(--block-2)", color: "var(--on-block-2)", ["--r" as string]: "-7deg", transform: "rotate(calc(-7deg * var(--tilt)))" } },
  { className: "right-[-0.25rem] bottom-[20%] md:right-[-2rem]", style: { background: "var(--block-4)", color: "var(--on-block-4)", ["--r" as string]: "-4deg", transform: "rotate(calc(-4deg * var(--tilt)))" } },
];

function Portrait() {
  const { config } = useContent();
  const { person, hero } = config;
  const stickers = (hero?.marquee ?? []).slice(0, 3);
  return (
    <div className="portrait relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[26rem]">
      {/* Forma de fondo: círculo lila sólido desplazado */}
      <span
        aria-hidden="true"
        className="decor absolute -right-3 -top-4 h-[62%] w-[62%] rounded-full md:-right-10 md:-top-8"
        style={{ background: "var(--block-2)" }}
      />
      <div
        className="arch relative z-10 aspect-[4/5] w-full border-[length:var(--bw)] border-[color:var(--line)] shadow-[var(--pop-lg)]"
        style={{ background: "var(--block-1)" }}
      >
        {person.photo ? (
          <img
            src={person.photo.src}
                {...responsive(person.photo.src, "(min-width: 1024px) 420px, 85vw")}
            alt={person.photo.alt}
            width={640}
            height={800}
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ objectPosition: person.photo.focus ?? "center" }}
          />
        ) : (
          <div aria-hidden="true" className="relative grid h-full w-full place-items-center">
            <span className="text-display translate-y-[3%] text-[clamp(7rem,24vw,12rem)] font-normal italic text-accent">
              {initials(person.name)}
            </span>
            <Sparkle className="absolute left-[18%] top-[26%] text-2xl text-accent" />
            <Sparkle className="absolute bottom-[22%] right-[20%] text-4xl text-fg" />
          </div>
        )}
      </div>

      {stickers.map((text, i) => (
        <span
          key={text}
          aria-hidden="true"
          className={`decor sticker pop-in absolute z-20 ${stickerSpots[i]!.className}`}
          style={{ ...stickerSpots[i]!.style, ["--d" as string]: `${300 + i * 120}ms` }}
        >
          {text}
        </span>
      ))}

      <Seal text={`${person.availability ?? person.role} ✦ ${person.name} ✦ `} />
    </div>
  );
}

function Name({ name }: { name: string }) {
  const [first, ...rest] = name.trim().split(/\s+/);
  return (
    <>
      {first}
      {rest.length > 0 && (
        <>
          {" "}
          <em>{rest.join(" ")}</em>
        </>
      )}
    </>
  );
}

export function Hero() {
  const { config, linkIsAvailable, isPro } = useContent();
  if (isPro) return <HeroPro />;
  const { person, hero, links } = config;
  // Si un botón apunta a una sección oculta, no se muestra.
  const primary = hero?.primaryCta && linkIsAvailable(hero.primaryCta.url) ? hero.primaryCta : undefined;
  const secondary = hero?.secondaryCta && linkIsAvailable(hero.secondaryCta.url) ? hero.secondaryCta : undefined;

  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="overflow-x-clip">
      <div className="container-page grid gap-x-12 gap-y-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-y-0">
        <div className="lg:col-span-7 lg:row-start-1 lg:self-end">
          {person.location && (
            <p className="hero-item mb-6 text-[0.9375rem] font-medium text-muted md:mb-8">{person.location}</p>
          )}
          {/* La disponibilidad se ve en el sello giratorio (decorativo); aquí la leen los lectores de pantalla. */}
          {person.availability && <p className="sr-only">{person.availability}</p>}

          <h1
            id="inicio-titulo"
            className="hero-item text-display text-[clamp(3.5rem,11.5vw,8rem)] leading-[0.92] [--d:80ms]"
          >
            <Name name={person.name} />
          </h1>

          <p className="hero-item mt-6 flex items-center gap-2 text-[1.0625rem] font-semibold [--d:140ms] md:mt-8">
            <Sparkle className="text-accent" />
            {person.role}
          </p>
        </div>

        <div className="hero-item px-6 [--d:160ms] sm:px-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">
          <Portrait />
        </div>

        <div className="lg:col-span-7 lg:row-start-2">
          <p className="rich hero-item lg:mt-5 max-w-[32ch] text-[1.375rem] leading-[1.4] text-fg/85 [--d:200ms] md:text-[1.625rem]">
            <Rich text={person.headline} />
          </p>

          {(primary || secondary || person.resume) && (
            <div className="hero-item mt-9 flex flex-col gap-4 [--d:260ms] sm:flex-row sm:flex-wrap">
              {primary && (
                <SmartLink link={primary} className="btn btn-primary group" showArrow={false}>
                  {primary.label}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </SmartLink>
              )}
              {secondary && <SmartLink link={secondary} className="btn btn-secondary" showArrow={false} />}
              {person.resume && <SmartLink link={person.resume} className="btn btn-secondary" />}
            </div>
          )}
          <SocialLinks links={links} className="hero-item mt-8 [--d:320ms]" />
        </div>
      </div>

      {hero?.marquee && hero.marquee.length > 0 && <Marquee items={hero.marquee} />}
    </section>
  );
}

function Marquee({ items }: { items: string[] }) {
  const { labels } = useContent();
  const [paused, setPaused] = useState(false);
  const run = Array.from({ length: Math.max(2, Math.ceil(8 / items.length)) }, () => items).flat();
  return (
    <div className="px-2 md:px-4">
      <div
        className={`marquee marquee-band relative overflow-hidden rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-accent py-4 text-accent-fg md:py-5 ${
          paused ? "is-paused" : ""
        }`}
      >
        <div aria-hidden="true" className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {run.map((item, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-title whitespace-nowrap px-6 text-[1.5rem] italic md:px-8 md:text-[2.125rem]">
                    {item}
                  </span>
                  <Sparkle className="shrink-0 text-lg" />
                </li>
              ))}
            </ul>
          ))}
        </div>
        {/* Control para detener el movimiento (WCAG 2.2.2) */}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? labels.playMotion : labels.pauseMotion}
          title={paused ? labels.playMotion : labels.pauseMotion}
          className="marquee-toggle absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-bg text-fg md:right-3"
        >
          {paused ? <Play className="text-base" /> : <Pause className="text-base" />}
        </button>
      </div>
    </div>
  );
}

/**
 * Portada del estilo "profesional": compacta, como un CV moderno.
 * Nombre, rol y frase a la izquierda; foto circular a la derecha; CV a la vista.
 */
function HeroPro() {
  const { config, linkIsAvailable } = useContent();
  const { person, hero, links } = config;
  const primary = hero?.primaryCta && linkIsAvailable(hero.primaryCta.url) ? hero.primaryCta : undefined;
  const secondary = hero?.secondaryCta && linkIsAvailable(hero.secondaryCta.url) ? hero.secondaryCta : undefined;

  return (
    <section id="inicio" aria-labelledby="inicio-titulo">
      <div className="container-page grid items-center gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-12 md:pb-20 md:pt-20">
        <div className="hero-item order-2 md:order-1 md:col-span-8">
          {person.availability && (
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border-[length:var(--bw)] border-[color:var(--line)] px-3.5 py-1.5 text-[0.875rem] font-medium">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50 [animation-duration:2.4s] [animation-iteration-count:3]" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              {person.availability}
            </p>
          )}
          <h1 id="inicio-titulo" className="text-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.02]">
            {person.name}
          </h1>
          <p className="mt-3 text-[1.25rem] font-semibold text-accent md:text-[1.5rem]">{person.role}</p>
          <p className="rich mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-fg/80 md:text-[1.1875rem]">
            <Rich text={person.headline} />
          </p>
          {person.location && <p className="mt-4 text-[0.9375rem] text-muted">{person.location}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {primary && (
              <SmartLink link={primary} className="btn btn-primary group" showArrow={false}>
                {primary.label}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </SmartLink>
            )}
            {person.resume && (
              <a href={person.resume.url} download className="btn btn-secondary">
                <Download />
                {person.resume.label}
              </a>
            )}
            {secondary && !person.resume && <SmartLink link={secondary} className="btn btn-secondary" showArrow={false} />}
          </div>
          <SocialLinks links={links} className="mt-6" />
        </div>

        <div className="hero-item order-1 md:order-2 md:col-span-4 md:justify-self-end [--d:120ms]">
          <div className="grid aspect-square w-32 place-items-center overflow-hidden rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-surface md:w-64">
            {person.photo ? (
              <img
                src={person.photo.src}
                {...responsive(person.photo.src, "(min-width: 768px) 256px, 128px")}
                alt={person.photo.alt}
                width={512}
                height={512}
                fetchPriority="high"
                className="h-full w-full object-cover"
                style={{ objectPosition: person.photo.focus ?? "center" }}
              />
            ) : (
              <span aria-hidden="true" className="text-display text-[2.5rem] text-accent md:text-[5rem]">
                {initials(person.name)}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

