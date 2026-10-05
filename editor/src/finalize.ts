/**
 * Limpia la configuración antes de mostrarla o publicarla:
 * quita filas vacías, completa descripciones de fotos y arma el título para Google.
 * Así un formulario a medio llenar nunca rompe el portfolio.
 */
import type { Image, PortfolioConfig } from "../../src/lib/types";
import type { Profession } from "./professions";

const filled = (s?: string) => Boolean(s && s.trim());
const plain = (s: string) => s.replace(/\*/g, "").trim();

function img<T extends Image | undefined>(image: T, fallbackAlt: string): T {
  if (!image || !filled(image.src)) return undefined as T;
  return { ...image, alt: filled(image.alt) ? image.alt : fallbackAlt } as T;
}

export function cleanConfig(input: PortfolioConfig, opts: { placeholders?: Profession } = {}): PortfolioConfig {
  const c = structuredClone(input);
  const prof = opts.placeholders;

  // Hero
  if (prof) {
    if (!filled(c.person.name)) c.person.name = "Tu nombre";
    if (!filled(c.person.role)) c.person.role = prof.role;
    if (!filled(c.person.headline)) c.person.headline = prof.headline;
  }
  const name = c.person.name.trim();
  c.person.photo = img(c.person.photo, `Foto de ${name}`);
  c.person.whatsapp = c.person.whatsapp?.replace(/\D/g, "") || undefined;
  c.person.email = c.person.email?.trim() || undefined;
  c.person.location = c.person.location?.trim() || undefined;
  c.person.availability = c.person.availability?.trim() || undefined;
  c.links = c.links.filter((l) => filled(l.url));
  if (c.hero) c.hero.marquee = (c.hero.marquee ?? []).map((m) => m.trim()).filter(Boolean);

  // Secciones
  if (c.about) {
    const text = Array.isArray(c.about.text) ? c.about.text : [c.about.text];
    c.about.text = text.filter(filled);
    c.about.points = (c.about.points ?? []).filter((p) => filled(p.label) && filled(p.text));
    c.about.photo = img(c.about.photo, `Foto de ${name}`);
  }
  if (c.projects) {
    c.projects.items = c.projects.items
      .filter((p) => filled(p.title))
      .map((p) => ({
        ...p,
        summary: filled(p.summary) ? p.summary : " ",
        cover: img(p.cover, p.title),
        tools: p.tools?.filter(filled),
        outcomes: p.outcomes?.filter((o) => filled(o.value) && filled(o.label)),
        gallery: p.gallery?.map((g) => img(g, p.title)).filter((g): g is Image => Boolean(g)),
        process: Array.isArray(p.process) ? p.process.filter(filled) : p.process,
        links: p.links?.filter((l) => filled(l.url)),
      }));
  }
  if (c.gallery) {
    c.gallery.items = c.gallery.items
      .filter((g) => filled(g.src))
      .map((g) => ({ ...g, alt: filled(g.alt) ? g.alt : g.caption || `Trabajo de ${name}` }));
  }
  if (c.services) {
    c.services.items = c.services.items
      .filter((s) => filled(s.name))
      .map((s) => ({ ...s, description: s.description ?? "", details: s.details?.filter(filled) }));
  }
  if (c.testimonials) c.testimonials.items = c.testimonials.items.filter((t) => filled(t.quote) && filled(t.name));
  if (c.skills) {
    c.skills.groups = c.skills.groups
      .map((g) => ({ ...g, items: g.items.map((i) => i.trim()).filter(Boolean) }))
      .filter((g) => filled(g.name) && g.items.length);
  }
  if (c.lab) {
    c.lab.lookingFor = c.lab.lookingFor?.trim() || undefined;
    c.lab.items = c.lab.items.filter((i) => filled(i.title)).map((i) => ({ ...i, description: i.description ?? "" }));
  }
  if (c.experience) {
    c.experience.items = c.experience.items
      .filter((e) => filled(e.role) && filled(e.company))
      .map((e) => ({ ...e, period: e.period ?? "", achievements: e.achievements?.filter(filled) }));
  }
  if (c.education) {
    c.education.items = c.education.items.filter((e) => filled(e.program));
    c.education.certifications = (c.education.certifications ?? []).filter((e) => filled(e.name));
  }
  if (c.contact) c.contact.photo = img(c.contact.photo, `Foto de ${name}`);

  // SEO: si no lo escribió, lo armamos con su nombre y su frase
  if (!filled(c.site.title)) c.site.title = `${name} — ${plain(c.person.role)}`;
  if (!filled(c.site.description)) {
    c.site.description = (plain(c.person.headline) || `${name} · ${plain(c.person.role)}`).slice(0, 160);
  }
  c.site.url = c.site.url?.trim() || undefined;
  // La imagen para redes es su foto principal
  c.site.ogImage = c.person.photo?.src;
  c.site.favicon = "";

  return c;
}

/** Recorre la configuración y devuelve todas las fotos que usa. */
export function usedImages(config: PortfolioConfig): string[] {
  const found = new Set<string>();
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if ((k === "src" || k === "ogImage") && typeof val === "string" && val.startsWith("/fotos/")) found.add(val);
        else if (k === "url" && typeof val === "string" && val.startsWith("/archivos/")) found.add(val);
        else walk(val);
      }
    }
  };
  walk(config);
  return [...found];
}
