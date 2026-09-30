import config from "../../portfolio.config.ts";
import type { Labels, Project, SectionId } from "./types.ts";

const defaultLabels: Labels = {
  skipToContent: "Saltar al contenido",
  menu: "Menú",
  closeMenu: "Cerrar menú",
  mainNav: "Navegación principal",
  theme: "Tema",
  themeLight: "Cambiar a modo claro",
  themeDark: "Cambiar a modo oscuro",
  themeSystem: "Sistema",
  viewProject: "Ver proyecto",
  close: "Cerrar",
  role: "Rol",
  tools: "Herramientas",
  year: "Año",
  type: "Tipo",
  problem: "El problema",
  process: "El proceso",
  result: "El resultado",
  outcomes: "Resultados",
  nextProject: "Siguiente",
  previousProject: "Anterior",
  writeMe: "Escribirme",
  writeWhatsApp: "Escribir por WhatsApp",
  pauseMotion: "Pausar la cinta",
  playMotion: "Reanudar la cinta",
  whatsappHello: "Hola, vi tu portfolio y me gustaría conversar.",
  whatsappAbout: "Hola, vi tu portfolio y quiero información sobre:",
  askService: "Consultar",
  featured: "El más pedido",
  openPhoto: "Ampliar foto",
  previousPhoto: "Foto anterior",
  nextPhoto: "Foto siguiente",
  navGallery: "Galería",
  navTestimonials: "Testimonios",
  navSkills: "Habilidades",
  navEducation: "Formación",
  navMore: "Más",
  navServices: "Servicios",
  titleGallery: "*Galería*",
  titleServices: "Lo que *ofrezco*",
  titleTestimonials: "Lo que *dicen*",
  copyEmail: "Copiar email",
  copied: "Copiado",
  lookingFor: "Buscando",
  updated: "Actualizado",
  certifications: "Certificaciones",
  backToTop: "Volver arriba",
  madeWith: "Hecho con",
  initiativeOf: "una iniciativa de",
  navProjects: "Proyectos",
  navAbout: "Sobre mí",
  navLab: "En proceso",
  navExperience: "Experiencia",
  navContact: "Contacto",
  titleProjects: "Proyectos *seleccionados*",
  titleAbout: "Sobre *mí*",
  titleSkills: "Lo que *sé hacer*",
  titleLab: "En *proceso*",
  titleExperience: "*Experiencia*",
  titleEducation: "*Formación*",
  titleContact: "Contacto",
  opensInNewTab: "(se abre en una pestaña nueva)",
};

/**
 * Crédito de la plantilla. Bloom es una iniciativa de Qodira.
 * Los parámetros utm permiten a Qodira saber cuántas visitas llegan desde los portfolios.
 */
const UTM = "utm_source=bloom-portfolio&utm_medium=credito";
export const CREDIT = {
  bloom: { name: "Bloom", url: `https://www.qodira.com/es/bloom?${UTM}` },
  qodira: { name: "Qodira", url: `https://www.qodira.com/?${UTM}` },
};

export const labels: Labels = { ...defaultLabels, ...config.labels };

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export type ResolvedProject = Project & { slug: string };

export const projects: ResolvedProject[] = (config.projects?.items ?? []).map((p) => ({
  ...p,
  slug: p.slug ? slugify(p.slug) : slugify(p.title),
}));

/** Ancla (id del DOM) de cada sección. */
export const sectionAnchor: Record<SectionId, string> = {
  projects: "proyectos",
  gallery: "galeria",
  services: "servicios",
  testimonials: "testimonios",
  about: "sobre-mi",
  skills: "habilidades",
  lab: "laboratorio",
  experience: "experiencia",
  education: "formacion",
  contact: "contacto",
};

/** Una sección se muestra si está en `sections` y tiene contenido. */
function hasContent(id: SectionId): boolean {
  switch (id) {
    case "projects":
      return projects.length > 0;
    case "gallery":
      return Boolean(config.gallery?.items.length);
    case "services":
      return Boolean(config.services?.items.length);
    case "testimonials":
      return Boolean(config.testimonials?.items.length);
    case "about":
      return Boolean(config.about && (config.about.text.length > 0 || config.about.points?.length));
    case "skills":
      return Boolean(config.skills?.groups.some((g) => g.items.length > 0));
    case "lab":
      return Boolean(config.lab && (config.lab.items.length || config.lab.lookingFor));
    case "experience":
      return Boolean(config.experience?.items.length);
    case "education":
      return Boolean(config.education?.items.length || config.education?.certifications?.length);
    case "contact":
      return true;
  }
}

/** Secciones activadas (`true`) en `sections`, en su orden, que además tienen contenido. */
export const visibleSections: SectionId[] = (Object.entries(config.sections) as [SectionId, boolean | undefined][])
  .filter(([id, on]) => on === true && hasContent(id))
  .map(([id]) => id);

/** Secciones activadas pero sin contenido (para avisar al compilar). */
export const emptySections: SectionId[] = (Object.entries(config.sections) as [SectionId, boolean | undefined][])
  .filter(([id, on]) => on === true && !hasContent(id))
  .map(([id]) => id);

/**
 * ¿El enlace lleva a algún lado? Un ancla ("#servicios") a una sección oculta no.
 * Así, si ocultas una sección, los botones que apuntan a ella desaparecen solos.
 */
export function linkIsAvailable(url: string): boolean {
  if (!url.startsWith("#")) return true;
  const id = (Object.keys(sectionAnchor) as SectionId[]).find((k) => `#${sectionAnchor[k]}` === url);
  return id ? visibleSections.includes(id) : true;
}

/** Número editorial de cada sección ("01", "02"…) según su orden visible. */
export function sectionNumber(id: SectionId): string {
  return String(visibleSections.indexOf(id) + 1).padStart(2, "0");
}

const navLabelFor: Partial<Record<SectionId, keyof Labels>> = {
  projects: "navProjects",
  gallery: "navGallery",
  services: "navServices",
  about: "navAbout",
  lab: "navLab",
  experience: "navExperience",
  testimonials: "navTestimonials",
  skills: "navSkills",
  education: "navEducation",
};

/** En escritorio se ven las primeras secciones; el resto va en el botón "Más". */
export const NAV_VISIBLE_DESKTOP = 4;

/** Menú: todas las secciones visibles (en tu orden) + contacto al final. */
export const navItems = [
  ...visibleSections.filter((id) => navLabelFor[id]),
  ...(visibleSections.includes("contact") ? (["contact"] as const) : []),
].map((id) => ({
  id,
  href: `#${sectionAnchor[id]}`,
  label: id === "contact" ? labels.navContact : labels[navLabelFor[id]!],
}));

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * El canal de contacto principal, en un solo lugar:
 * WhatsApp si hay número, si no, email. `topic` agrega el servicio al mensaje.
 */
export function contactLink(topic?: string): { label: string; url: string } | undefined {
  const { whatsapp, email } = config.person;
  const phone = whatsapp?.replace(/\D/g, "");
  if (phone) {
    const text = topic ? `${labels.whatsappAbout} ${topic}` : labels.whatsappHello;
    return { label: labels.writeWhatsApp, url: `https://wa.me/${phone}?text=${encodeURIComponent(text)}` };
  }
  if (email) {
    return { label: labels.writeMe, url: `mailto:${email}${topic ? `?subject=${encodeURIComponent(topic)}` : ""}` };
  }
  return undefined;
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export { config };
