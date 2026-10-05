import { useRef, useState } from "react";
import { AI_PROMPT, applyAiData, extractJson, isBloomExport } from "../importer";
import { findProfession } from "../professions";
import { blankConfig } from "../store";
import { Card } from "../ui/fields";
import type { StepProps } from "./shared";

/** Atajo: llenar todo el portfolio con la respuesta de una IA a partir del CV. */
export function ImportCard({ editor }: StepProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setOpen(true);
      alert("No pudimos copiar automáticamente. Selecciona el texto de las instrucciones y cópialo.");
    }
  };

  const fill = (raw: string) => {
    setMessage(null);
    let data: unknown;
    try {
      data = extractJson(raw);
    } catch {
      setMessage({
        ok: false,
        text: "No encontramos la información en ese texto. Asegúrate de pegar la respuesta completa de la IA, desde la primera { hasta la última }.",
      });
      return;
    }
    if (isBloomExport(data)) {
      editor.loadImported(data.config);
      return;
    }
    const current = editor.state!.config;
    const hasContent = Boolean(current.person.name.trim());
    if (hasContent && !confirm("Esto reemplazará los textos que ya escribiste (tus fotos se conservan). ¿Continuar?")) return;
    const aiProf = findProfession((data as { profesionId?: string })?.profesionId);
    const base = hasContent ? current : blankConfig(aiProf ?? findProfession(editor.state!.professionId) ?? findProfession("inicio")!);
    const result = applyAiData(base, data);
    if (!result.filled.length) {
      setMessage({ ok: false, text: "La respuesta no traía datos para llenar. Revisa que la IA haya usado el formato de las instrucciones." });
      return;
    }
    editor.loadImported(
      result.config,
      result.professionId,
      `¡Listo! Llenamos: ${result.filled.join(", ")}. Revisa cada paso, ajusta lo que quieras y agrega tus fotos.`,
    );
  };

  const readFile = async (f: File | undefined) => {
    if (!f) return;
    if (/\.(pdf|docx?)$/i.test(f.name)) {
      setMessage({
        ok: false,
        text: "Para usar tu CV en PDF o Word, súbelo a tu IA junto con las instrucciones (paso 2) y pega aquí la respuesta.",
      });
      return;
    }
    fill(await f.text());
  };

  return (
    <Card
      title="¿Tienes tu CV o un resumen de tu trabajo?"
      description="Llena todo tu portfolio de una vez con ayuda de una IA. Sirven las versiones gratuitas de ChatGPT, Gemini, Claude o Copilot."
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-12 rounded-xl bg-brand px-5 text-[0.9375rem] font-bold text-white transition hover:bg-brand-dark"
        >
          Llenar con mi CV
        </button>
      ) : (
        <ol className="flex flex-col gap-5">
          <li className="flex gap-3">
            <Num n={1} />
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-[0.9375rem] font-semibold text-ink">Copia las instrucciones para la IA</p>
              <button
                type="button"
                onClick={copyPrompt}
                className="min-h-11 self-start rounded-xl bg-ink px-4 text-[0.875rem] font-bold text-white transition hover:bg-brand"
              >
                {copied ? "✓ Copiadas" : "Copiar instrucciones"}
              </button>
              <details className="text-[0.8125rem] text-ink/60">
                <summary className="cursor-pointer font-semibold">Ver las instrucciones</summary>
                <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-3 font-mono text-[0.75rem] leading-relaxed text-ink/80">{AI_PROMPT}</pre>
              </details>
            </div>
          </li>
          <li className="flex gap-3">
            <Num n={2} />
            <p className="flex-1 text-[0.9375rem] leading-relaxed text-ink">
              <strong>Abre tu IA</strong> (ChatGPT, Gemini, Claude…), pega las instrucciones y <strong>adjunta tu CV</strong>. Si no tienes CV, escríbele sobre ti al final del mensaje: qué haces, tu experiencia, tus servicios y tus redes.
            </p>
          </li>
          <li className="flex gap-3">
            <Num n={3} />
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="ai-answer" className="text-[0.9375rem] font-semibold text-ink">
                Copia la respuesta de la IA y pégala aquí
              </label>
              <textarea
                id="ai-answer"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='La respuesta empieza con { "profesionId": … y termina con }'
                className="w-full rounded-xl border border-line bg-white px-4 py-3 font-mono text-[0.8125rem] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!text.trim()}
                  onClick={() => fill(text)}
                  className="min-h-12 rounded-xl bg-brand px-5 text-[0.9375rem] font-bold text-white transition hover:bg-brand-dark disabled:opacity-40"
                >
                  Llenar mi portfolio
                </button>
                <button type="button" onClick={() => file.current?.click()} className="min-h-11 text-[0.875rem] font-semibold text-brand hover:underline">
                  o sube un archivo (.txt o .json)
                </button>
                <input ref={file} type="file" accept=".json,.txt,.md,.pdf,.doc,.docx" hidden onChange={(e) => readFile(e.target.files?.[0])} />
              </div>
              {message && (
                <p role="alert" className={`rounded-xl px-4 py-3 text-[0.875rem] ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
                  {message.text}
                </p>
              )}
              <p className="text-[0.8125rem] text-ink/55">Después revisas todo paso a paso y agregas tus fotos (la IA no puede ponerlas).</p>
            </div>
          </li>
        </ol>
      )}
    </Card>
  );
}

function Num({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[0.875rem] font-bold text-brand">
      {n}
    </span>
  );
}
