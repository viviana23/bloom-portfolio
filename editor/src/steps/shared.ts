import type { SectionId } from "../../../src/lib/types";
import type { Profession } from "../professions";
import type { Editor } from "../store";
import type { ImageCtx } from "../ui/fields";

export interface StepProps {
  editor: Editor;
  ctx: ImageCtx;
  prof?: Profession;
}

/** En qué paso del editor se llena cada sección. */
export const STEP_FOR_SECTION: Record<SectionId, { step: number; name: string }> = {
  about: { step: 1, name: "Sobre ti" },
  projects: { step: 2, name: "Tu trabajo" },
  gallery: { step: 2, name: "Tu trabajo" },
  services: { step: 3, name: "Lo que ofreces" },
  testimonials: { step: 3, name: "Lo que ofreces" },
  skills: { step: 4, name: "Trayectoria" },
  lab: { step: 4, name: "Trayectoria" },
  experience: { step: 4, name: "Trayectoria" },
  education: { step: 4, name: "Trayectoria" },
  contact: { step: 5, name: "Contacto" },
};

/** ¿La sección está visible? y cómo cambiarlo. */
export function sectionSwitch(editor: Editor, id: SectionId) {
  return {
    shown: editor.state!.config.sections[id] === true,
    onShownChange: (v: boolean) =>
      editor.update((c) => {
        c.sections[id] = v;
      }),
  };
}
