import { useCallback, useEffect, useRef, useState } from "react";
import { useContent, type ResolvedProject } from "../lib/content";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import { Section } from "./primitives";

const HASH_PREFIX = "#proyecto/";

function slugFromHash(projects: ResolvedProject[]): string | null {
  if (!location.hash.startsWith(HASH_PREFIX)) return null;
  const slug = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
  return projects.some((p) => p.slug === slug) ? slug : null;
}

export function Projects() {
  const { config, labels, projects } = useContent();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Si el diálogo se abrió desde la página, cerrar = volver atrás en el historial.
  const openedInPage = useRef(false);

  useEffect(() => {
    setOpenSlug(slugFromHash(projects));
    const onHash = () => {
      const slug = slugFromHash(projects);
      if (slug) openedInPage.current = true;
      setOpenSlug(slug);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const close = useCallback(() => {
    if (openedInPage.current) {
      openedInPage.current = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      setOpenSlug(null);
    }
  }, []);

  const navigate = useCallback((slug: string) => {
    history.replaceState(null, "", HASH_PREFIX + slug);
    setOpenSlug(slug);
  }, []);

  // Con un número impar de proyectos, el primero ocupa todo el ancho.
  // Así 1, 2, 3, 4, 5 o 6 proyectos siempre forman una retícula completa.
  const firstIsWide = projects.length % 2 === 1;

  return (
    <Section id="projects" title={config.projects?.title ?? labels.titleProjects} intro={config.projects?.intro} revealContent={false}>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} wide={firstIsWide && i === 0} />
        ))}
      </div>
      <ProjectDialog
        project={projects.find((p) => p.slug === openSlug) ?? null}
        onClose={close}
        onNavigate={navigate}
      />
    </Section>
  );
}
