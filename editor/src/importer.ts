/**
 * Llenar el portfolio de una vez: con la respuesta de una IA (ChatGPT, Gemini,
 * Claude, Copilot…) a partir del CV de la persona, o con un portfolio descargado antes.
 */
import type { PortfolioConfig, SectionId } from "../../src/lib/types";
import { professions } from "./professions";

/** Instrucciones para copiar y pegar en cualquier IA. */
export const AI_PROMPT = `Eres una experta en marcas personales. Voy a darte mi CV o un resumen de mi trabajo. Con esa información, arma el contenido de mi portfolio web.

REGLAS
- Usa SOLO la información que te doy. No inventes datos, clientes, cifras ni testimonios. Si algo no está, déjalo vacío ("") o como lista vacía ([]).
- Escribe en español, en primera persona, con un tono cercano y profesional.
- Textos cortos: el portfolio debe leerse fácil en el celular.
- Responde ÚNICAMENTE con un bloque de código JSON válido, sin explicaciones antes ni después.

FORMATO (respeta exactamente estos nombres):
{
  "profesionId": "elige UNO: ${professions.map((p) => p.id).join(", ")}",
  "nombre": "",
  "profesion": "a qué me dedico, en pocas palabras. Ej: Diseñadora UX · Producto digital",
  "frase": "una frase de una línea sobre lo que hago y para quién. Pon entre *asteriscos* 2 a 4 palabras clave para destacarlas",
  "ciudad": "Ciudad, País",
  "disponibilidad": "Ej: Disponible para nuevos proyectos",
  "especialidades": ["3 a 5 palabras clave"],
  "sobreMi": ["párrafo 1: quién soy y qué hago (máx. 2 frases)", "párrafo 2 opcional"],
  "queHago": "", "queMeInspira": "", "haciaDondeVoy": "",
  "whatsapp": "con código de país, solo números. Ej: 573001234567",
  "correo": "",
  "redes": { "instagram": "", "tiktok": "", "facebook": "", "linkedin": "", "youtube": "", "pinterest": "", "behance": "", "web": "" },
  "proyectos": [{ "titulo": "", "resumen": "1 o 2 frases", "tipo": "Ej: Cliente, Personal, Académico", "anio": "", "reto": "", "proceso": "", "resultado": "" }],
  "servicios": [{ "nombre": "", "descripcion": "", "precio": "", "incluye": [""] }],
  "testimonios": [{ "comentario": "", "nombre": "", "contexto": "" }],
  "habilidades": [{ "grupo": "Ej: Herramientas", "items": [""] }],
  "experiencia": [{ "cargo": "", "empresa": "", "fechas": "Ej: 2021 — Hoy", "descripcion": "", "logros": [""] }],
  "formacion": [{ "programa": "", "institucion": "", "fechas": "" }],
  "certificaciones": [{ "nombre": "", "entidad": "", "anio": "" }],
  "enProceso": { "buscando": "qué oportunidades busco hoy", "items": [{ "titulo": "", "descripcion": "", "tipo": "Ej: Curso, Reto", "estado": "En curso o Terminado" }] }
}

Máximo 3 proyectos (los más relevantes), 6 servicios y 6 experiencias.

MI INFORMACIÓN:
[Adjunta tu CV o escribe aquí sobre ti]`;

type Str = string | undefined;
interface AiData {
  profesionId?: Str;
  nombre?: Str;
  profesion?: Str;
  frase?: Str;
  ciudad?: Str;
  disponibilidad?: Str;
  especialidades?: string[];
  sobreMi?: string[] | string;
  queHago?: Str;
  queMeInspira?: Str;
  haciaDondeVoy?: Str;
  whatsapp?: Str;
  correo?: Str;
  redes?: Record<string, Str>;
  proyectos?: { titulo?: Str; resumen?: Str; tipo?: Str; anio?: Str; reto?: Str; proceso?: Str; resultado?: Str }[];
  servicios?: { nombre?: Str; descripcion?: Str; precio?: Str; incluye?: string[] }[];
  testimonios?: { comentario?: Str; nombre?: Str; contexto?: Str }[];
  habilidades?: { grupo?: Str; items?: string[] }[];
  experiencia?: { cargo?: Str; empresa?: Str; fechas?: Str; descripcion?: Str; logros?: string[] }[];
  formacion?: { programa?: Str; institucion?: Str; fechas?: Str }[];
  certificaciones?: { nombre?: Str; entidad?: Str; anio?: Str }[];
  enProceso?: { buscando?: Str; items?: { titulo?: Str; descripcion?: Str; tipo?: Str; estado?: Str }[] };
}

/** Saca el JSON de la respuesta de la IA (aunque venga con texto o ``` alrededor). */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no-json");
  const raw = candidate
    .slice(start, end + 1)
    .replace(/[“”]/g, '"') // comillas tipográficas que a veces pegan los celulares
    .replace(/,\s*([}\]])/g, "$1"); // comas sobrantes al final de una lista
  return JSON.parse(raw);
}

const s = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const list = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const strings = (v: unknown): string[] => list<unknown>(v).map(s).filter(Boolean);

const networkLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  pinterest: "Pinterest",
  behance: "Behance",
  web: "Mi tienda o web",
};

export interface ImportResult {
  config: PortfolioConfig;
  professionId?: string;
  filled: string[];
}

/**
 * Pasa los datos de la IA a la configuración. Solo reemplaza lo que trae;
 * lo demás (fotos, colores, lo que ya escribió) se conserva.
 */
export function applyAiData(base: PortfolioConfig, input: unknown): ImportResult {
  const d = (input ?? {}) as AiData;
  const c = structuredClone(base);
  const filled: string[] = [];
  const on = (id: SectionId, label: string) => {
    c.sections[id] = true;
    filled.push(label);
  };

  if (s(d.nombre)) c.person.name = s(d.nombre);
  if (s(d.profesion)) c.person.role = s(d.profesion);
  if (s(d.frase)) c.person.headline = s(d.frase);
  if (s(d.ciudad)) c.person.location = s(d.ciudad);
  if (s(d.disponibilidad)) c.person.availability = s(d.disponibilidad);
  if (s(d.nombre) || s(d.frase)) filled.push("Tu presentación");
  const especialidades = strings(d.especialidades);
  if (especialidades.length) c.hero = { ...c.hero, marquee: especialidades.slice(0, 6) };

  const about = typeof d.sobreMi === "string" ? [s(d.sobreMi)] : strings(d.sobreMi);
  const points = [
    { label: "Qué hago", text: s(d.queHago) },
    { label: "Qué me inspira", text: s(d.queMeInspira) },
    { label: "Hacia dónde voy", text: s(d.haciaDondeVoy) },
  ].filter((p) => p.text);
  if (about.length || points.length) {
    c.about = { ...c.about, text: about.length ? about.slice(0, 2) : c.about?.text ?? [""], points: points.length ? points : c.about?.points };
    on("about", "Sobre mí");
  }

  const phone = s(d.whatsapp).replace(/\D/g, "");
  if (phone.length >= 8) c.person.whatsapp = phone;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s(d.correo))) c.person.email = s(d.correo);
  const links = Object.entries(d.redes ?? {})
    .map(([k, v]) => ({ label: networkLabels[k.toLowerCase()] ?? k, url: s(v) }))
    .filter((l) => l.url)
    .map((l) => ({ ...l, url: /^https?:\/\//.test(l.url) ? l.url : `https://${l.url}` }));
  if (links.length) c.links = links;
  if (phone || s(d.correo) || links.length) filled.push("Contacto y redes");

  const proyectos = list<NonNullable<AiData["proyectos"]>[number]>(d.proyectos).filter((p) => s(p?.titulo));
  if (proyectos.length) {
    c.projects = {
      ...c.projects,
      items: proyectos.slice(0, 6).map((p) => ({
        title: s(p.titulo),
        summary: s(p.resumen),
        type: s(p.tipo) || undefined,
        year: s(p.anio) || undefined,
        problem: s(p.reto) || undefined,
        process: s(p.proceso) || undefined,
        result: s(p.resultado) || undefined,
      })),
    };
    on("projects", `${proyectos.length} ${proyectos.length === 1 ? "proyecto" : "proyectos"}`);
  }

  const servicios = list<NonNullable<AiData["servicios"]>[number]>(d.servicios).filter((x) => s(x?.nombre));
  if (servicios.length) {
    c.services = {
      ...c.services,
      items: servicios.slice(0, 6).map((x) => ({
        name: s(x.nombre),
        description: s(x.descripcion),
        price: s(x.precio) || undefined,
        details: strings(x.incluye),
      })),
    };
    on("services", `${servicios.length} ${servicios.length === 1 ? "servicio" : "servicios"}`);
  }

  const testimonios = list<NonNullable<AiData["testimonios"]>[number]>(d.testimonios).filter((t) => s(t?.comentario) && s(t?.nombre));
  if (testimonios.length) {
    c.testimonials = { ...c.testimonials, items: testimonios.map((t) => ({ quote: s(t.comentario), name: s(t.nombre), context: s(t.contexto) || undefined })) };
    on("testimonials", "Testimonios");
  }

  const habilidades = list<NonNullable<AiData["habilidades"]>[number]>(d.habilidades).filter((g) => s(g?.grupo) && strings(g?.items).length);
  if (habilidades.length) {
    c.skills = { ...c.skills, groups: habilidades.slice(0, 6).map((g) => ({ name: s(g.grupo), items: strings(g.items) })) };
    on("skills", "Habilidades");
  }

  const experiencia = list<NonNullable<AiData["experiencia"]>[number]>(d.experiencia).filter((e) => s(e?.cargo) && s(e?.empresa));
  if (experiencia.length) {
    c.experience = {
      ...c.experience,
      items: experiencia.slice(0, 8).map((e) => ({
        role: s(e.cargo),
        company: s(e.empresa),
        period: s(e.fechas),
        description: s(e.descripcion) || undefined,
        achievements: strings(e.logros),
      })),
    };
    on("experience", "Experiencia");
  }

  const formacion = list<NonNullable<AiData["formacion"]>[number]>(d.formacion).filter((e) => s(e?.programa));
  const certs = list<NonNullable<AiData["certificaciones"]>[number]>(d.certificaciones).filter((e) => s(e?.nombre));
  if (formacion.length || certs.length) {
    c.education = {
      items: formacion.map((e) => ({ program: s(e.programa), institution: s(e.institucion), period: s(e.fechas) || undefined })),
      certifications: certs.map((e) => ({ name: s(e.nombre), issuer: s(e.entidad) || undefined, year: s(e.anio) || undefined })),
    };
    on("education", "Formación");
  }

  const proceso = d.enProceso;
  const procesoItems = list<NonNullable<NonNullable<AiData["enProceso"]>["items"]>[number]>(proceso?.items).filter((i) => s(i?.titulo));
  if (s(proceso?.buscando) || procesoItems.length) {
    c.lab = {
      ...c.lab,
      lookingFor: s(proceso?.buscando) || c.lab?.lookingFor,
      items: procesoItems.length
        ? procesoItems.map((i) => ({ title: s(i.titulo), description: s(i.descripcion), kind: s(i.tipo) || undefined, status: s(i.estado) || undefined }))
        : c.lab?.items ?? [],
    };
    on("lab", "En proceso");
  }

  const professionId = professions.some((p) => p.id === s(d.profesionId)) ? s(d.profesionId) : undefined;
  return { config: c, professionId, filled };
}

/** ¿Es un portfolio descargado del editor (mi-portfolio.json)? */
export function isBloomExport(data: unknown): data is { bloom: number; config: PortfolioConfig } {
  return Boolean(data && typeof data === "object" && "bloom" in data && "config" in data);
}
