import type { SectionId } from "../../../src/lib/types";
import type { Profession } from "../professions";
import type { Editor } from "../store";
import type { ImageCtx } from "../ui/fields";

export interface StepProps {
  editor: Editor;
  ctx: ImageCtx;
  prof?: Profession;
}

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
