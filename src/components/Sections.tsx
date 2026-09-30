import { config, contactLink, labels } from "../lib/content";
import { responsive } from "../lib/images";
import { useReveal } from "../lib/hooks";
import { ArrowRight, Sparkle } from "./Icons";
import { Section, SmartLink } from "./primitives";

const blockStyle = (n: number) => ({ background: `var(--block-${n})`, color: `var(--on-block-${n})` });

/* ── Sobre mí: bento ──────────────────────────────────────────── */
export function About() {
  const about = config.about!;
  const { person } = config;
  const paragraphs = Array.isArray(about.text) ? about.text : [about.text];
  const points = about.points ?? [];
  return (
    <Section id="about" title={about.title ?? labels.titleAbout}>
      <div className="grid gap-4 md:grid-cols-6 md:gap-5">
        <div className="tile flex flex-col gap-5 border-[length:var(--bw)] border-[color:var(--line)] bg-surface p-7 md:col-span-4 md:p-10">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? "text-title text-[1.625rem] leading-[1.3] md:text-[2rem]" : "text-[1.0625rem] leading-relaxed text-muted"}
            >
              {p}
            </p>
          ))}
        </div>

        {about.photo ? (
          <div className="tile relative min-h-[20rem] overflow-hidden border-[length:var(--bw)] border-[color:var(--line)] md:col-span-2">
            <img
              src={about.photo.src}
                {...responsive(about.photo.src, "(min-width: 768px) 33vw, 100vw")}
              alt={about.photo.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: about.photo.focus ?? "center" }}
            />
            {person.location && (
              <span className="sticker absolute bottom-4 left-4 max-w-[calc(100%-2rem)] whitespace-normal bg-bg text-fg">
                <Sparkle aria-hidden="true" className="shrink-0 text-accent" />
                {person.location}
              </span>
            )}
          </div>
        ) : (
        <div className="tile flex flex-col justify-between gap-8 bg-fg p-7 text-bg md:col-span-2 md:p-8">
          <Sparkle className="text-4xl text-accent" />
          <div>
            {person.location && <p className="text-title text-[1.625rem] leading-tight">{person.location}</p>}
            {person.availability && (
              <p className="mt-3 inline-flex items-center gap-2 text-[0.9375rem] font-medium opacity-80">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                {person.availability}
              </p>
            )}
          </div>
        </div>
        )}

        {points.map((pt, i) => (
          <div
            key={pt.label}
            className={`tile tile-pop flex flex-col gap-6 border-[length:var(--bw)] border-[color:var(--line)] p-7 md:p-8 ${
              points.length === 1 ? "md:col-span-6" : points.length === 2 ? "md:col-span-3" : "md:col-span-2"
            }`}
            style={blockStyle((i % 4) + 1)}
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line-current)] font-serif text-lg italic">
              {i + 1}
            </span>
            <div>
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] opacity-75">{pt.label}</h3>
              <p className="text-title mt-2 text-[1.375rem] leading-snug">{pt.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── Habilidades: mosaicos de color ───────────────────────────── */
export function Skills() {
  const skills = config.skills!;
  const groups = skills.groups.filter((g) => g.items.length > 0);
  return (
    <Section id="skills" title={skills.title ?? labels.titleSkills} intro={skills.intro}>
      <div className={`grid gap-4 sm:grid-cols-2 md:gap-5 ${groups.length >= 4 ? "lg:grid-cols-4" : groups.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {groups.map((group, i) => (
          <div key={group.name} className="tile tile-pop flex flex-col gap-6 border-[length:var(--bw)] border-[color:var(--line)] p-6 md:p-7" style={blockStyle((i % 4) + 1)}>
            <div className="flex items-center justify-between">
              <h3 className="text-title text-[1.75rem] italic">{group.name}</h3>
              <span className="text-[0.8125rem] font-semibold opacity-70">{group.items.length}</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="chip border-[length:var(--bw)] border-[color:var(--line)] bg-bg text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── Laboratorio ──────────────────────────────────────────────── */
function LabCard({ item, index }: { item: NonNullable<typeof config.lab>["items"][number]; index: number }) {
  const ref = useReveal<HTMLLIElement>();
  const ongoing = item.status && /curso|progress|progreso|andamento/i.test(item.status);
  return (
    <li
      ref={ref}
      className="reveal tile tile-pop group relative flex flex-col gap-5 border-[length:var(--bw)] border-[color:var(--line)] bg-bg p-6 md:p-7"
      style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line)] font-serif text-lg italic"
          style={blockStyle((index % 4) + 1)}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {item.status && (
          <span className={`chip ${ongoing ? "bg-accent text-accent-fg" : "border-[length:var(--bw)] border-[color:var(--line)]"}`}>
            {ongoing && <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-iteration-count:3]" />}
            {item.status}
          </span>
        )}
      </div>
      <div>
        {(item.kind || item.year) && (
          <p className="text-eyebrow mb-2">{[item.kind, item.year].filter(Boolean).join(" · ")}</p>
        )}
        <h3 className="text-title text-[1.5rem] leading-tight md:text-[1.625rem]">
          {item.link ? (
            <SmartLink
              link={{ label: item.title, url: item.link.url }}
              className="inline-flex items-center gap-2 after:absolute after:inset-0 hover:text-accent"
            />
          ) : (
            item.title
          )}
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{item.description}</p>
      </div>
    </li>
  );
}

export function Lab() {
  const lab = config.lab!;
  const cta = contactLink(lab.lookingFor);
  return (
    <Section id="lab" title={lab.title ?? labels.titleLab} intro={lab.intro} band={3} revealContent={false}>
      {lab.lookingFor && (
        <div className="relative mb-8 flex flex-col gap-6 rounded-[calc(1.75rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-bg p-7 pt-9 text-fg shadow-[var(--pop)] md:mb-10 md:flex-row md:items-center md:justify-between md:gap-10 md:p-9">
          {/* Cinta adhesiva (solo en el estilo divertido) */}
          <span
            aria-hidden="true"
            className="decor-playful absolute -top-3 left-10 h-6 w-20 rotate-[calc(-3deg*var(--tilt))] rounded-sm border-[length:var(--bw)] border-[color:var(--line)]"
            style={{ background: "var(--block-1)" }}
          />
          <div>
            <p className="chip bg-accent text-accent-fg">{labels.lookingFor}</p>
            <p className="text-title mt-4 max-w-2xl text-[1.625rem] leading-snug md:text-[2rem]">{lab.lookingFor}</p>
          </div>
          {cta && (
            <SmartLink link={cta} showArrow={false} className="btn btn-primary shrink-0 self-start md:self-center">
              {cta.label}
              <ArrowRight />
            </SmartLink>
          )}
        </div>
      )}
      {lab.items.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {lab.items.map((item, i) => (
            <LabCard key={item.title} item={item} index={i} />
          ))}
        </ul>
      )}
      {lab.updated && (
        <p className="mt-8 text-[0.875rem] font-medium opacity-75">
          {labels.updated}: {lab.updated}
        </p>
      )}
    </Section>
  );
}

/* ── Experiencia: línea de tiempo sobre tinta ─────────────────── */
export function Experience() {
  const exp = config.experience!;
  return (
    <Section id="experience" title={exp.title ?? labels.titleExperience} band="ink">
      <ol className="relative flex flex-col gap-10 border-l-[length:var(--bw)] border-bg/25 pl-8 md:ml-4 md:gap-14 md:pl-12">
        {exp.items.map((item, i) => (
          <li key={item.role + item.company} className="relative grid gap-3 md:grid-cols-12 md:gap-8">
            <span
              aria-hidden="true"
              className="absolute -left-[2.6rem] top-1 h-5 w-5 rounded-full border-[length:var(--bw)] border-bg md:-left-[3.6rem]"
              style={{ background: i === 0 ? "var(--block-1)" : "var(--fg)" }}
            />
            <p className="md:col-span-3">
              <span className="chip bg-bg text-fg">{item.period}</span>
            </p>
            <div className="md:col-span-9">
              <h3 className="text-title text-[1.75rem] leading-tight md:text-[2.25rem]">
                {item.role} <em className="!text-block-1">· {item.company}</em>
              </h3>
              {item.location && <p className="mt-1 text-[0.875rem] opacity-70">{item.location}</p>}
              {item.description && <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed opacity-90">{item.description}</p>}
              {item.achievements && item.achievements.length > 0 && (
                <ul className="mt-5 flex flex-col gap-3">
                  {item.achievements.map((a) => (
                    <li key={a} className="flex gap-3 text-[0.9375rem] leading-relaxed opacity-90">
                      <Sparkle className="mt-1 shrink-0 text-[0.8rem] text-block-1" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ── Formación ────────────────────────────────────────────────── */
export function Education() {
  const edu = config.education!;
  const certs = edu.certifications ?? [];
  return (
    <Section id="education" title={edu.title ?? labels.titleEducation}>
      {edu.items.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {edu.items.map((item, i) => (
            <li key={item.program + item.institution} className="tile flex gap-5 border-[length:var(--bw)] border-[color:var(--line)] bg-surface p-6 md:p-7">
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[length:var(--bw)] border-[color:var(--line)]"
                style={blockStyle(((i + 1) % 4) + 1)}
              >
                <Sparkle className="text-lg" />
              </span>
              <div>
                {item.period && <p className="text-eyebrow mb-1.5">{item.period}</p>}
                <h3 className="text-title text-[1.5rem] leading-tight">{item.program}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{item.institution}</p>
                {item.description && <p className="mt-3 text-[0.9375rem] leading-relaxed">{item.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {certs.length > 0 && (
        <div className={edu.items.length ? "mt-10" : ""}>
          <h3 className="text-eyebrow mb-4">{labels.certifications}</h3>
          <ul className="flex flex-wrap gap-3">
            {certs.map((c, i) => (
              <li key={c.name} className="sticker max-w-full flex-wrap whitespace-normal" style={blockStyle((i % 4) + 1)}>
                <Sparkle aria-hidden="true" className="text-[0.75rem]" />
                {c.url ? (
                  <SmartLink link={{ label: c.name, url: c.url }} className="link-underline inline-flex items-center gap-1" />
                ) : (
                  c.name
                )}
                {(c.issuer || c.year) && (
                  <span className="font-normal opacity-70">· {[c.issuer, c.year].filter(Boolean).join(", ")}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
