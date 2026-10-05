/**
 * Bloom Portfolio — tipos del archivo de contenido.
 *
 * No necesitas editar este archivo. Sirve para que tu editor te avise
 * si falta algo o si un campo tiene un formato incorrecto en
 * `portfolio.config.ts`.
 */

import type { PaletteName, StyleName } from "./themes.ts";

/** Una imagen siempre lleva texto alternativo: describe lo que se ve. */
export interface Image {
  /** Ruta dentro de /public (ej. "/proyectos/mi-app.jpg") o una URL completa. */
  src: string;
  /** Descripción breve para personas que usan lector de pantalla. */
  alt: string;
  /**
   * Qué parte de la foto se ve cuando se recorta (opcional):
   * "top", "center", "bottom", "left", "right" o combinaciones como "left top".
   */
  focus?: string;
}

export interface Link {
  label: string;
  /** URL completa (https://…), "mailto:…" o un ancla interna ("#proyectos"). */
  url: string;
}

export type SectionId =
  | "projects"
  | "gallery"
  | "services"
  | "testimonials"
  | "about"
  | "skills"
  | "lab"
  | "experience"
  | "education"
  | "contact";

export interface Palette {
  /** Fondo de la página. */
  background: string;
  /** Color principal del texto. */
  foreground: string;
  /** Tu color de acento. Se usa con moderación: enlaces, detalles, foco. */
  accent: string;
  /** Texto secundario (fechas, descripciones). */
  muted: string;
  /** Líneas divisorias finas. */
  border: string;
  /**
   * Cuatro colores sólidos para tarjetas, stickers y bloques de color.
   * El texto encima se elige solo para que siempre se lea bien.
   */
  blocks: [string, string, string, string];
}

export interface Project {
  /** Título del proyecto. */
  title: string;
  /** Una o dos frases. Es lo que se ve en la tarjeta. */
  summary: string;
  /** Tipo de proyecto: "Trabajo para cliente", "Proyecto personal", "Académico"… */
  type?: string;
  year?: string;
  /** Tu rol. Sé específica: "Diseño y prototipado", "Análisis de datos". */
  role?: string;
  tools?: string[];
  /** Imagen de portada. Si no tienes, la tarjeta se muestra en versión tipográfica. */
  cover?: Image;
  /** ¿Qué problema había? */
  problem?: string;
  /** ¿Qué hiciste y cómo? Un texto o una lista de pasos. */
  process?: string | string[];
  /** ¿Qué pasó al final? Incluye aprendizajes aunque no haya métricas. */
  result?: string;
  /** Resultados cortos y concretos. Ej. { value: "−40%", label: "tiempo de carga" } */
  outcomes?: { value: string; label: string }[];
  /** Imágenes adicionales para el detalle del proyecto. */
  gallery?: Image[];
  /** Enlaces: demo, repositorio, caso completo… */
  links?: Link[];
  /** Identificador para la URL. Se genera solo a partir del título si no lo pones. */
  slug?: string;
}

export interface LabItem {
  title: string;
  description: string;
  /** "Experimento", "Open source", "Curso", "Reto personal", "Académico"… */
  kind?: string;
  /** "En curso", "Terminado", "Pausado"… */
  status?: string;
  year?: string;
  link?: Link;
}

export interface ExperienceItem {
  role: string;
  company: string;
  /** Texto libre: "2023 — Hoy", "Mar 2021 — Dic 2022". */
  period: string;
  location?: string;
  description?: string;
  achievements?: string[];
}

export interface EducationItem {
  program: string;
  institution: string;
  period?: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  year?: string;
  url?: string;
}

export interface PortfolioConfig {
  site: {
    /** Idioma de la página: "es", "en", "pt"… */
    lang: string;
    /** URL final donde vivirá tu portfolio (ej. "https://tunombre.com"). Déjala vacía si aún no la tienes. */
    url?: string;
    /** Título que aparece en la pestaña y en Google. */
    title: string;
    /** Descripción para Google y redes (150 caracteres aprox.). */
    description: string;
    /** Imagen al compartir el enlace en redes (1200×630, PNG o JPG). */
    ogImage?: string;
    /** Ruta a tu favicon. Si lo dejas vacío, se genera uno con tus iniciales. */
    favicon?: string;
    /** Muestra "Hecho con Bloom Portfolio" en el pie de página. */
    showCredit?: boolean;
    /** Botón flotante de WhatsApp (o email si no tienes WhatsApp). Por defecto: true. */
    floatingButton?: boolean;
  };

  person: {
    name: string;
    /** Tu profesión o área. */
    role: string;
    /** Tu frase de posicionamiento. Usa *asteriscos* para resaltar palabras. */
    headline: string;
    location?: string;
    /** Estado breve junto a un punto de color: "Disponible para proyectos freelance". */
    availability?: string;
    photo?: Image;
    email?: string;
    /**
     * Tu WhatsApp con código de país, sin "+" ni espacios (ej. "573001234567").
     * Si lo pones, todos los botones de encargo y contacto abren WhatsApp
     * con un mensaje ya escrito. Si no, usan tu email.
     */
    whatsapp?: string;
    /** Enlace a tu CV (PDF en /public o URL). */
    resume?: Link;
  };

  /** Redes y perfiles. Agrega o quita los que quieras. */
  links: Link[];

  hero?: {
    primaryCta?: Link;
    secondaryCta?: Link;
    /** Palabras que pasan lentamente bajo el hero (opcional). */
    marquee?: string[];
  };

  about?: {
    title?: string;
    /** Uno o dos párrafos breves. */
    text: string | string[];
    /** Foto para el bloque de "Sobre mí" (opcional). */
    photo?: Image;
    /** Pequeños bloques: "Qué hago", "Qué me interesa", "Hacia dónde voy"… */
    points?: { label: string; text: string }[];
  };

  skills?: {
    title?: string;
    intro?: string;
    groups: { name: string; items: string[] }[];
  };

  projects?: {
    title?: string;
    intro?: string;
    items: Project[];
  };

  /** Galería de fotos: tu trabajo en imágenes. */
  gallery?: {
    title?: string;
    intro?: string;
    items: (Image & { caption?: string })[];
  };

  /** Servicios o encargos que ofreces. */
  services?: {
    title?: string;
    intro?: string;
    items: {
      name: string;
      description: string;
      /** Texto libre: "Desde $180.000", "A convenir". */
      price?: string;
      details?: string[];
      /** Destaca este servicio con un sticker. */
      featured?: boolean;
      /** Botón propio. Si no lo pones, abre un email con el nombre del servicio. */
      cta?: Link;
    }[];
  };

  /** Lo que dicen de tu trabajo. Usa solo testimonios reales. */
  testimonials?: {
    title?: string;
    items: { quote: string; name: string; context?: string }[];
  };

  /**
   * En proceso: lo que buscas ahora y en qué estás trabajando
   * (proyectos personales, cursos, experimentos, retos).
   */
  lab?: {
    title?: string;
    intro?: string;
    /** Qué oportunidades buscas hoy: clientes, alianzas, empleo… Se muestra destacado. */
    lookingFor?: string;
    /** Cuándo lo actualizaste por última vez: "Septiembre 2026". */
    updated?: string;
    items: LabItem[];
  };

  experience?: {
    title?: string;
    items: ExperienceItem[];
  };

  education?: {
    title?: string;
    items: EducationItem[];
    certifications?: Certification[];
  };

  contact?: {
    /** Usa *asteriscos* para resaltar palabras. */
    title?: string;
    text?: string;
    /** Botón principal. Si no lo pones, se usa "Escribirme" con tu email. */
    cta?: Link;
    /** Foto tipo polaroid junto a la tarjeta de contacto (opcional). */
    photo?: Image;
  };

  /**
   * Qué secciones se muestran y en qué orden.
   * `true` = se muestra · `false` = se oculta. El orden de la lista es el orden en la página.
   */
  sections: Partial<Record<SectionId, boolean>>;

  theme: {
    /**
     * El carácter visual del sitio:
     * · "divertido": bordes marcados, sombras de sticker, elementos girados.
     * · "elegante": líneas finas, sin sombras, tipografía serif clásica.
     * · "minimal": limpio y sobrio, tipografía sans, sin decoraciones.
     * · "profesional": estructura de CV y portfolio para carreras digitales
     *   (tecnología, diseño UX, datos, marketing): compacto, sin bandas de color.
     */
    style?: StyleName;
    /** Una paleta lista (claro + oscuro): "fresa", "salvia", "arena", "lavanda" o "tinta". */
    palette?: PaletteName;
    /** Tema inicial para quien visita por primera vez. */
    defaultMode?: "light" | "dark" | "system";
    /** Ajustes de color encima de la paleta (opcional). Solo escribe los que quieras cambiar. */
    light?: Partial<Palette>;
    dark?: Partial<Palette>;
  };

  /** Textos de la interfaz. Solo cambia los que quieras (útil si tu portfolio está en otro idioma). */
  labels?: Partial<Labels>;
}

export interface Labels {
  skipToContent: string;
  menu: string;
  closeMenu: string;
  mainNav: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  viewProject: string;
  close: string;
  role: string;
  tools: string;
  year: string;
  type: string;
  problem: string;
  process: string;
  result: string;
  outcomes: string;
  nextProject: string;
  previousProject: string;
  writeMe: string;
  writeWhatsApp: string;
  pauseMotion: string;
  playMotion: string;
  whatsappHello: string;
  whatsappAbout: string;
  askService: string;
  featured: string;
  openPhoto: string;
  previousPhoto: string;
  nextPhoto: string;
  navGallery: string;
  navTestimonials: string;
  navSkills: string;
  navEducation: string;
  navMore: string;
  navServices: string;
  titleGallery: string;
  titleServices: string;
  titleTestimonials: string;
  copyEmail: string;
  copied: string;
  lookingFor: string;
  updated: string;
  certifications: string;
  backToTop: string;
  madeWith: string;
  initiativeOf: string;
  navProjects: string;
  navAbout: string;
  navLab: string;
  navExperience: string;
  navContact: string;
  titleProjects: string;
  titleAbout: string;
  titleSkills: string;
  titleLab: string;
  titleExperience: string;
  titleEducation: string;
  titleContact: string;
  opensInNewTab: string;
}

/**
 * Envuelve tu configuración para obtener autocompletado y validación.
 * No cambia nada del contenido.
 */
export function definePortfolio(config: PortfolioConfig): PortfolioConfig {
  return config;
}
