/**
 * Contenido de ejemplo para la vista previa: las secciones activas que todavía
 * están vacías se muestran con textos de muestra, así se ve cómo quedará el
 * portfolio desde el primer momento. Nunca se descarga ni se publica.
 */
import type { PortfolioConfig, SectionId } from "../../src/lib/types";
import { createContent } from "../../src/lib/content";
import type { Profession } from "./professions";

type Fill = (c: PortfolioConfig) => void;

const creative: Partial<Record<SectionId, Fill>> = {
  projects: (c) =>
    (c.projects = {
      ...c.projects,
      items: [
        { title: "Tu proyecto favorito", summary: "Cuenta en una o dos líneas qué hiciste, para quién y qué resultado tuvo.", type: "Encargo", year: "2026" },
        { title: "Un trabajo que te enorgullece", summary: "El reto, cómo lo resolviste y lo que dijo tu cliente.", type: "Colaboración", year: "2025" },
        { title: "Algo que muestre tu estilo", summary: "Una pieza que diga quién eres sin necesidad de explicarlo.", type: "Personal", year: "2025" },
      ],
    }),
  about: (c) =>
    (c.about = {
      ...c.about,
      text: ["Aquí va quién eres y qué haces, en una o dos frases.", "Y aquí, qué te hace diferente o cómo trabajas con tus clientes."],
      points: [
        { label: "Qué hago", text: "Lo que ofreces, en pocas palabras." },
        { label: "Qué me inspira", text: "Lo que te mueve a hacer tu trabajo." },
        { label: "Hacia dónde voy", text: "Tu próxima meta." },
      ],
    }),
  services: (c) =>
    (c.services = {
      ...c.services,
      items: [
        { name: "Tu servicio principal", description: "Qué incluye y para quién es.", price: "Desde $…", details: ["Detalle 1", "Detalle 2"] },
        { name: "Un servicio especial", description: "El que más te piden o el que más disfrutas.", price: "A convenir", featured: true },
        { name: "Talleres o asesorías", description: "Si enseñas o acompañas, cuéntalo aquí.", price: "Desde $…" },
      ],
    }),
  testimonials: (c) =>
    (c.testimonials = {
      ...c.testimonials,
      items: [
        { quote: "Aquí va lo que una clienta dijo de tu trabajo. Usa solo comentarios reales.", name: "Nombre de tu clienta", context: "Qué le hiciste" },
        { quote: "Un segundo comentario ayuda a dar confianza.", name: "Otra clienta", context: "Ciudad o proyecto" },
      ],
    }),
  skills: (c) =>
    (c.skills = {
      ...c.skills,
      groups: [
        { name: "Lo que domino", items: ["Habilidad 1", "Habilidad 2", "Habilidad 3"] },
        { name: "Herramientas", items: ["Herramienta 1", "Herramienta 2"] },
      ],
    }),
  lab: (c) =>
    (c.lab = {
      ...c.lab,
      lookingFor: "Qué buscas hoy: clientes nuevos, alianzas, empleo…",
      items: [{ title: "En lo que estás trabajando", description: "Un curso, un reto o un proyecto personal.", status: "En curso" }],
    }),
  experience: (c) =>
    (c.experience = {
      ...c.experience,
      items: [
        { role: "Tu cargo o rol", company: "Empresa o proyecto", period: "2023 — hoy", description: "Qué hacías y qué lograste." },
        { role: "Un rol anterior", company: "Otra empresa", period: "2020 — 2023" },
      ],
    }),
  education: (c) =>
    (c.education = {
      ...c.education,
      items: [{ program: "Lo que estudiaste", institution: "Dónde lo estudiaste", period: "2018 — 2022" }],
      certifications: [{ name: "Un curso o certificado", issuer: "Quién lo dio", year: "2025" }],
    }),
};

const career: Partial<Record<SectionId, Fill>> = {
  ...creative,
  projects: (c) =>
    (c.projects = {
      ...c.projects,
      items: [
        { title: "Tu caso más importante", summary: "El problema, lo que hiciste y el resultado en números.", type: "Proyecto", year: "2026", tools: ["Herramienta 1", "Herramienta 2"] },
        { title: "Otro proyecto destacado", summary: "Qué construiste o mejoraste, y para quién.", type: "Freelance", year: "2025", tools: ["Herramienta 3"] },
      ],
    }),
  about: (c) =>
    (c.about = {
      ...c.about,
      text: ["Aquí va quién eres profesionalmente, en una o dos frases.", "Y aquí, en qué tipo de equipos o retos das lo mejor de ti."],
      points: [
        { label: "Qué hago", text: "Tu especialidad, en pocas palabras." },
        { label: "Hacia dónde voy", text: "El rol o el reto que buscas." },
      ],
    }),
};

/** Rellena con ejemplos las secciones activas y vacías. Devuelve cuáles se rellenaron. */
export function withExamples(config: PortfolioConfig, prof?: Profession): { config: PortfolioConfig; examples: SectionId[] } {
  const empty = createContent(config).emptySections;
  if (!empty.length) return { config, examples: [] };
  const fills = prof?.kind === "carrera" ? career : creative;
  const c = structuredClone(config);
  const examples = empty.filter((id) => {
    const fill = fills[id];
    if (!fill) return false;
    fill(c);
    return true;
  });
  return { config: c, examples };
}
