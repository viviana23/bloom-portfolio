/**
 * Profesiones del editor: cada una trae el estilo, la paleta, las palabras
 * del menú y las secciones que mejor le funcionan. Son puntos de partida:
 * todo se puede cambiar después.
 */
import type { Labels, PortfolioConfig, SectionId } from "../../src/lib/types";
import type { PaletteName, StyleName } from "../../src/lib/themes";

type Kind = "visual" | "servicios" | "carrera" | "inicio";

export interface Profession {
  id: string;
  name: string;
  style: StyleName;
  palette: PaletteName;
  kind: Kind;
  role: string;
  headline: string;
  marquee: string[];
  labels?: Partial<Labels>;
}

/** Orden único de las secciones (el de la plantilla). La profesión solo decide cuáles se encienden. */
export const ALL_SECTIONS: SectionId[] = [
  "projects", "gallery", "about", "services", "testimonials", "skills", "lab", "experience", "education", "contact",
];

/** Secciones encendidas según el tipo de trabajo. */
const sectionsByKind: Record<Kind, SectionId[]> = {
  visual: ["projects", "gallery", "about", "services", "testimonials", "contact"],
  servicios: ["projects", "about", "services", "testimonials", "education", "contact"],
  carrera: ["projects", "about", "skills", "lab", "experience", "education", "contact"],
  inicio: ["projects", "about", "skills", "lab", "education", "contact"],
};

export function sectionsFor(kind: Kind): PortfolioConfig["sections"] {
  const on = sectionsByKind[kind];
  const sections: PortfolioConfig["sections"] = {};
  for (const id of ALL_SECTIONS) sections[id] = on.includes(id);
  return sections;
}

const encargos: Partial<Labels> = {
  navServices: "Encargos",
  titleServices: "Encargos y *servicios*",
  askService: "Pedir presupuesto",
};

export const professions: Profession[] = [
  {
    id: "reposteria", name: "Repostera o pastelera", style: "divertido", palette: "fresa", kind: "visual",
    role: "Repostera · Pastelería de autor",
    headline: "Pasteles hechos a mano para celebraciones que merecen *recordarse por el sabor*.",
    marquee: ["Pasteles", "Postres", "Por encargo"],
    labels: { ...encargos, navProjects: "Creaciones", titleProjects: "Creaciones *destacadas*", titleGallery: "Recién *horneado*" },
  },
  {
    id: "cocina", name: "Chef o cocina saludable", style: "divertido", palette: "salvia", kind: "visual",
    role: "Chef · Cocina de temporada",
    headline: "Cocino con ingredientes de temporada para que comer bien sea *un placer*.",
    marquee: ["Catering", "Menús", "Clases de cocina"],
    labels: { ...encargos, navProjects: "Platos", titleProjects: "Platos *destacados*", titleGallery: "De mi *cocina*" },
  },
  {
    id: "belleza", name: "Maquilladora, uñas o estética", style: "divertido", palette: "fresa", kind: "visual",
    role: "Maquilladora profesional",
    headline: "Te ayudo a verte como te sientes: *auténtica y segura*.",
    marquee: ["Maquillaje", "Novias", "Eventos"],
    labels: { navServices: "Servicios", titleServices: "Mis *servicios*", askService: "Reservar", navProjects: "Trabajos", titleProjects: "Trabajos *recientes*", titleGallery: "Antes y *después*" },
  },
  {
    id: "ilustracion", name: "Ilustradora, artista o tatuadora", style: "divertido", palette: "lavanda", kind: "visual",
    role: "Ilustradora",
    headline: "Ilustro historias con color, *humor y mucha ternura*.",
    marquee: ["Ilustración", "Murales", "Encargos"],
    labels: { ...encargos, navProjects: "Obras", titleProjects: "Obras *seleccionadas*", titleGallery: "Mi *galería*" },
  },
  {
    id: "contenido", name: "Creadora de contenido o marketing", style: "divertido", palette: "lavanda", kind: "carrera",
    role: "Creadora de contenido · Estratega digital",
    headline: "Creo contenido que conecta marcas con personas *de verdad*.",
    marquee: ["Contenido", "Redes sociales", "Estrategia"],
    labels: { navProjects: "Campañas", titleProjects: "Campañas *destacadas*" },
  },
  {
    id: "artesania", name: "Artesana, joyería o hecho a mano", style: "divertido", palette: "arena", kind: "visual",
    role: "Artesana · Piezas hechas a mano",
    headline: "Piezas únicas hechas a mano, *con tiempo y con cariño*.",
    marquee: ["Hecho a mano", "Piezas únicas", "Por encargo"],
    labels: { ...encargos, navProjects: "Piezas", titleProjects: "Piezas *destacadas*", titleGallery: "Mi *taller*" },
  },
  {
    id: "educacion", name: "Profesora o talleres", style: "divertido", palette: "salvia", kind: "servicios",
    role: "Profesora · Talleres creativos",
    headline: "Enseño de forma cercana para que aprender sea *una alegría*.",
    marquee: ["Clases", "Talleres", "Acompañamiento"],
    labels: { navServices: "Clases", titleServices: "Clases y *talleres*", askService: "Quiero inscribirme" },
  },
  {
    id: "eventos", name: "Wedding planner o eventos", style: "elegante", palette: "arena", kind: "visual",
    role: "Wedding planner · Organización de eventos",
    headline: "Diseño celebraciones para que tú *solo tengas que disfrutar*.",
    marquee: ["Bodas", "Eventos", "Diseño de experiencias"],
    labels: { navProjects: "Eventos", titleProjects: "Eventos *realizados*", navServices: "Paquetes", titleServices: "Mis *paquetes*", askService: "Agendar una cita" },
  },
  {
    id: "floristeria", name: "Florista o decoradora", style: "elegante", palette: "salvia", kind: "visual",
    role: "Florista · Diseño floral",
    headline: "Flores que cuentan *tu historia*.",
    marquee: ["Ramos", "Bodas", "Decoración"],
    labels: { ...encargos, navProjects: "Diseños", titleProjects: "Diseños *florales*" },
  },
  {
    id: "bienestar", name: "Yoga, bienestar o nutrición", style: "elegante", palette: "salvia", kind: "servicios",
    role: "Instructora de yoga · Bienestar",
    headline: "Te acompaño a encontrar *calma, fuerza y equilibrio*.",
    marquee: ["Yoga", "Bienestar", "Respiración"],
    labels: { navServices: "Programas", titleServices: "Mis *programas*", askService: "Reservar mi lugar" },
  },
  {
    id: "coaching", name: "Coach o mentora", style: "elegante", palette: "arena", kind: "servicios",
    role: "Coach de vida y carrera",
    headline: "Te ayudo a tomar decisiones con *claridad y confianza*.",
    marquee: ["Coaching", "Mentoría", "Talleres"],
    labels: { navServices: "Programas", titleServices: "Cómo puedo *ayudarte*", askService: "Agendar una sesión", navProjects: "Historias", titleProjects: "Historias de *cambio*" },
  },
  {
    id: "moda", name: "Estilista o diseñadora de moda", style: "elegante", palette: "tinta", kind: "visual",
    role: "Diseñadora de moda",
    headline: "Diseño prendas que se sienten *como una segunda piel*.",
    marquee: ["Colecciones", "A medida", "Estilismo"],
    labels: { navProjects: "Colecciones", titleProjects: "Colecciones *recientes*", askService: "Agendar una cita" },
  },
  {
    id: "fotografia", name: "Fotógrafa o videógrafa", style: "minimal", palette: "tinta", kind: "visual",
    role: "Fotógrafa",
    headline: "Fotografío momentos reales para que *los recuerdes siempre*.",
    marquee: ["Retratos", "Bodas", "Marcas"],
    labels: { navProjects: "Sesiones", titleProjects: "Sesiones *recientes*", navServices: "Paquetes", titleServices: "Mis *paquetes*", askService: "Reservar sesión", titleGallery: "*Portafolio*" },
  },
  {
    id: "diseno", name: "Diseñadora gráfica o UX/UI", style: "minimal", palette: "lavanda", kind: "carrera",
    role: "Diseñadora UX/UI",
    headline: "Diseño productos digitales que las personas *entienden a la primera*.",
    marquee: ["Diseño UX", "Interfaces", "Branding"],
    labels: { navProjects: "Casos", titleProjects: "Casos de *estudio*" },
  },
  {
    id: "tecnologia", name: "Desarrolladora o tecnología", style: "minimal", palette: "tinta", kind: "carrera",
    role: "Desarrolladora web",
    headline: "Construyo productos digitales *rápidos, accesibles y útiles*.",
    marquee: ["Desarrollo web", "Datos", "Automatización"],
  },
  {
    id: "psicologia", name: "Psicóloga o terapeuta", style: "minimal", palette: "salvia", kind: "servicios",
    role: "Psicóloga clínica",
    headline: "Un espacio seguro para *escucharte y acompañarte*.",
    marquee: ["Terapia", "Acompañamiento", "Talleres"],
    labels: { navServices: "Consulta", titleServices: "Cómo *trabajamos*", askService: "Agendar una cita" },
  },
  {
    id: "arquitectura", name: "Arquitecta o interiorista", style: "minimal", palette: "arena", kind: "visual",
    role: "Arquitecta · Diseño de interiores",
    headline: "Diseño espacios que *se sienten como casa*.",
    marquee: ["Interiores", "Remodelación", "Asesoría"],
    labels: { navProjects: "Proyectos", titleProjects: "Proyectos *realizados*" },
  },
  {
    id: "consultoria", name: "Abogada, contadora o consultora", style: "minimal", palette: "arena", kind: "servicios",
    role: "Abogada · Asesoría para emprendedoras",
    headline: "Te asesoro para que tu negocio crezca *con tranquilidad*.",
    marquee: ["Asesoría", "Empresas", "Emprendedoras"],
    labels: { navServices: "Servicios", titleServices: "Cómo puedo *ayudarte*", askService: "Agendar una consulta", navProjects: "Casos", titleProjects: "Casos de *éxito*" },
  },
  {
    id: "inicio", name: "Estoy empezando / otra profesión", style: "divertido", palette: "lavanda", kind: "inicio",
    role: "Tu profesión",
    headline: "Una frase que diga qué haces y *para quién lo haces*.",
    marquee: ["Lo que haces", "Tu especialidad", "Lo que te apasiona"],
  },
];

export function findProfession(id: string | undefined): Profession | undefined {
  return professions.find((p) => p.id === id);
}
