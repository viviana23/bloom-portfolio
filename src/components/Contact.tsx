import { useState } from "react";
import { responsive } from "../lib/images";
import { CREDIT, sectionAnchor, useContent } from "../lib/content";
import { useReveal } from "../lib/hooks";
import { ArrowRight, ArrowUp, ArrowUpRight, Check, Copy, Sparkle } from "./Icons";
import { Rich, SmartLink, SocialLinks } from "./primitives";

function CopyEmail({ email }: { email: string }) {
  const { labels } = useContent();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <a href={`mailto:${email}`} className="text-title self-start text-[1.375rem] [overflow-wrap:anywhere] md:text-[1.625rem] inline-flex min-h-11 items-center">
        <span className="link-underline">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-2 self-start rounded-full border-[length:var(--bw)] border-[color:var(--line)] px-4 text-[0.875rem] font-semibold transition-colors hover:bg-block-3 hover:text-on-block-3"
      >
        {copied ? <Check className="text-accent" /> : <Copy />}
        <span aria-live="polite">{copied ? labels.copied : labels.copyEmail}</span>
      </button>
    </div>
  );
}

export function Contact() {
  const { config, contactLink, labels, sectionNumber, isPro } = useContent();
  const { contact, person, links } = config;
  const ref = useReveal<HTMLDivElement>();
  const cta = contact?.cta ?? contactLink();
  // La tarjeta solo aparece si hay algo que mostrar (email, botón o redes).
  const hasCard = Boolean(person.email || cta || links.length > 0);

  return (
    <div className="px-2 pb-2 pt-3 md:px-4 md:pb-4">
      <div
        className={
          isPro
            ? "border-t-[length:var(--bw)] border-[color:var(--line)] pt-16 md:pt-20"
            : "rounded-[calc(2rem*var(--round))] pt-16 md:rounded-[calc(3rem*var(--round))] md:pt-24"
        }
        style={isPro ? undefined : { background: "var(--block-1)", color: "var(--on-block-1)" }}
      >
        <section id={sectionAnchor.contact} aria-labelledby="contacto-titulo">
          <div ref={ref} className="reveal container-page grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <p aria-hidden="true" className="bloom-section-number chip mb-6 border-[length:var(--bw)] border-[color:var(--line-current)]">
                <Sparkle className="text-[0.7rem] text-accent" />
                {sectionNumber("contact")} · {labels.titleContact}
              </p>
              <h2 id="contacto-titulo" className="text-display text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.02]">
                <Rich text={contact?.title ?? labels.titleContact} />
              </h2>
              {contact?.text && <p className="mt-8 max-w-xl text-lg leading-relaxed opacity-85">{contact.text}</p>}
            </div>

            {hasCard && (
            <div className="relative lg:col-span-5">
              {contact?.photo && (
                <figure
                  className="pop-in relative z-20 mx-auto mb-[-2rem] w-40 rotate-[calc(6deg*var(--tilt))] rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-bg p-2 shadow-[var(--pop)] [--r:6deg] lg:absolute lg:-right-8 lg:-top-24 lg:mb-0 lg:w-44"
                >
                  <img
                    src={contact.photo.src}
                {...responsive(contact.photo.src, "208px")}
                    alt={contact.photo.alt}
                    loading="lazy"
                    className="aspect-square w-full rounded-[calc(0.85rem*var(--round))] object-cover"
                  />
                </figure>
              )}
              {!contact?.photo && (
              <span
                aria-hidden="true"
                className="decor-playful sticker pop-in absolute -top-5 right-6 z-10 [--r:8deg] [--d:200ms]"
                style={{ background: "var(--block-3)", color: "var(--on-block-3)", transform: "rotate(calc(8deg * var(--tilt)))" }}
              >
                <Sparkle /> {labels.writeMe}
              </span>
              )}
              <div className="relative z-10 flex flex-col gap-7 rounded-[calc(1.75rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-bg p-7 text-fg shadow-[var(--pop-lg)] md:p-9">
                {person.email && <CopyEmail email={person.email} />}
                {cta && (
                  <SmartLink link={cta} className="btn btn-primary group w-full text-base" showArrow={false}>
                    {cta.label}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </SmartLink>
                )}
                {links.length > 0 && (
                  <div className={person.email || cta ? "border-t-[length:var(--bw)] border-fg/10 pt-6" : ""}>
                    <SocialLinks links={links} />
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </section>
        <SiteFooter />
      </div>
    </div>
  );
}

function CreditLink({ name, url }: { name: string; url: string }) {
  const { labels } = useContent();
  return (
    <a href={url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1 font-semibold md:min-h-0">
      <span className="link-underline">{name}</span>
      <ArrowUpRight aria-hidden="true" className="text-[0.85em] opacity-70" />
      <span className="sr-only"> {labels.opensInNewTab}</span>
    </a>
  );
}

/** Línea final: créditos y "volver arriba". */
function SiteFooter() {
  const { config, labels } = useContent();
  const { person, site } = config;
  return (
    <footer className="container-page mt-16 md:mt-24">
      <div className="flex flex-col gap-4 border-t-[length:var(--bw)] border-current/15 py-6 text-[0.875rem] md:flex-row md:items-center md:justify-between md:gap-8 md:py-8">
        <p className="opacity-80">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {person.name}
        </p>
        {site.showCredit !== false && (
          <p>
            <Sparkle aria-hidden="true" className="mr-1.5 inline align-[-0.05em] text-[0.7rem] text-accent" />
            <span className="opacity-80">{labels.madeWith} </span>
            <CreditLink {...CREDIT.bloom} />
            <span className="opacity-80">, {labels.initiativeOf} </span>
            <CreditLink {...CREDIT.qodira} />
          </p>
        )}
        <a
          href="#inicio"
          className="inline-flex h-11 items-center gap-2 self-start rounded-full border-[length:var(--bw)] border-[color:var(--line-current)] px-5 font-semibold transition-colors hover:bg-bg hover:text-fg md:self-auto"
        >
          {labels.backToTop}
          <ArrowUp />
        </a>
      </div>
    </footer>
  );
}

/** Pie de página cuando la sección de contacto está oculta. */
export function Footer() {
  const { visibleSections } = useContent();
  if (visibleSections.includes("contact")) return null;
  return (
    <div className="pb-4">
      <SiteFooter />
    </div>
  );
}
