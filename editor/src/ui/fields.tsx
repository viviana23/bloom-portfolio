/**
 * Piezas del formulario del editor. Pensadas para personas no técnicas:
 * etiquetas claras, ayudas cortas, botones grandes y nada de jerga.
 */
import { useId, useRef, useState, type ReactNode } from "react";
import { prepareUpload } from "../export";
import { newImagePath } from "../store";
import type { Image } from "../../../src/lib/types";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/15";

export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
}: {
  label: string;
  hint?: ReactNode;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  error?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.875rem] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? `${id}-help` : undefined}
        className={`${inputCls} ${error ? "border-red-400" : ""}`}
      />
      {(hint || error) && (
        <p id={`${id}-help`} className={`text-[0.8125rem] leading-snug ${error ? "text-red-600" : "text-ink/55"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  hint?: ReactNode;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.875rem] font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-help` : undefined}
        className={`${inputCls} resize-y leading-relaxed`}
      />
      {hint && (
        <p id={`${id}-help`} className="text-[0.8125rem] leading-snug text-ink/55">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Lista de textos, uno por línea (ej. "qué incluye"). */
export function LinesField(props: {
  label: string;
  hint?: ReactNode;
  value: string[] | undefined;
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <TextArea
      label={props.label}
      hint={props.hint ?? "Escribe una por línea."}
      value={(props.value ?? []).join("\n")}
      onChange={(v) => props.onChange(v.split("\n"))}
      placeholder={props.placeholder}
      rows={3}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-2 text-left"
    >
      <span>
        <span className="block text-[0.9375rem] font-semibold text-ink">{label}</span>
        {description && <span className="block text-[0.8125rem] text-ink/55">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-ink/20"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </button>
  );
}

/** Bloque de una sección, con su interruptor "Mostrar en mi portfolio". */
export function Card({
  title,
  description,
  shown,
  onShownChange,
  children,
}: {
  title: string;
  description?: string;
  shown?: boolean;
  onShownChange?: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[1.0625rem] font-bold text-ink">{title}</h3>
          {description && <p className="mt-1 text-[0.875rem] leading-snug text-ink/60">{description}</p>}
        </div>
        {onShownChange && (
          <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[0.8125rem] font-semibold text-ink/70">
            {shown ? "Visible" : "Oculta"}
            <span
              role="switch"
              aria-checked={shown}
              aria-label={`Mostrar "${title}" en mi portfolio`}
              tabIndex={0}
              onClick={() => onShownChange(!shown)}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onShownChange(!shown))}
              className={`relative h-6 w-11 rounded-full transition-colors ${shown ? "bg-brand" : "bg-ink/20"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${shown ? "translate-x-[22px]" : "translate-x-0.5"}`}
              />
            </span>
          </label>
        )}
      </div>
      <div className={`flex flex-col gap-5 ${shown === false ? "opacity-50" : ""}`}>{children}</div>
    </section>
  );
}

/** Lista editable: agregar, quitar y reordenar elementos. */
export function ListEditor<T>({
  items,
  onChange,
  create,
  addLabel,
  itemTitle,
  render,
  max = 30,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  addLabel: string;
  itemTitle: (item: T, index: number) => string;
  render: (item: T, update: (fn: (draft: T) => void) => void, index: number) => ReactNode;
  max?: number;
}) {
  const [open, setOpen] = useState<number | null>(items.length ? null : null);
  const set = (i: number, fn: (d: T) => void) => {
    const copy = structuredClone(items);
    fn(copy[i]!);
    onChange(copy);
  };
  const move = (i: number, dir: -1 | 1) => {
    const copy = [...items];
    const [it] = copy.splice(i, 1);
    copy.splice(i + dir, 0, it!);
    onChange(copy);
    setOpen(i + dir);
  };
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-line bg-paper">
          <div className="flex items-center gap-2 p-2 pl-4">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="min-h-11 flex-1 truncate text-left text-[0.9375rem] font-semibold text-ink"
            >
              <span className="mr-2 text-ink/40">{open === i ? "▾" : "▸"}</span>
              {itemTitle(item, i) || "Sin título"}
            </button>
            <IconBtn label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>↑</IconBtn>
            <IconBtn label="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</IconBtn>
            <IconBtn
              label="Quitar"
              onClick={() => {
                if (confirm(`¿Quitar "${itemTitle(item, i) || "este elemento"}"?`)) {
                  onChange(items.filter((_, j) => j !== i));
                  setOpen(null);
                }
              }}
            >
              ✕
            </IconBtn>
          </div>
          {open === i && (
            <div className="flex flex-col gap-4 border-t border-line p-4">{render(item, (fn) => set(i, fn), i)}</div>
          )}
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          onClick={() => {
            onChange([...items, create()]);
            setOpen(items.length);
          }}
          className="min-h-12 rounded-xl border-2 border-dashed border-brand/40 text-[0.9375rem] font-semibold text-brand transition hover:border-brand hover:bg-brand/5"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/5 hover:text-ink disabled:opacity-25"
    >
      {children}
    </button>
  );
}

// ── Fotos ────────────────────────────────────────────────────────

export interface ImageCtx {
  images: Map<string, Blob>;
  urlFor: (path: string) => string | undefined;
  addImage: (path: string, blob: Blob) => Promise<void>;
}

const focusOptions = [
  { value: "top", label: "Arriba" },
  { value: "center", label: "Centro" },
  { value: "bottom", label: "Abajo" },
];

/** Subir una foto, ver la miniatura, escribir su descripción y elegir qué parte se ve. */
export function ImagePicker({
  label,
  hint,
  value,
  onChange,
  ctx,
  altHint = "Describe lo que se ve. Ayuda a personas ciegas y a Google.",
  showFocus = false,
}: {
  label: string;
  hint?: string;
  value: Image | undefined;
  onChange: (img: Image | undefined) => void;
  ctx: ImageCtx;
  altHint?: string;
  showFocus?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const url = value?.src ? ctx.urlFor(value.src) : undefined;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const blob = await prepareUpload(file);
      const path = newImagePath(file.name);
      await ctx.addImage(path, blob);
      onChange({ src: path, alt: value?.alt ?? "", focus: value?.focus });
    } catch {
      alert("No pudimos leer esa foto. Prueba con una foto JPG o PNG.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.875rem] font-semibold text-ink">{label}</span>
      {hint && <p className="-mt-1 text-[0.8125rem] text-ink/55">{hint}</p>}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-brand/40 bg-brand/5 text-[0.8125rem] font-semibold text-brand transition hover:border-brand"
          style={url ? { backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: value?.focus ?? "center", borderStyle: "solid" } : undefined}
          aria-label={url ? `Cambiar foto: ${label}` : `Subir foto: ${label}`}
        >
          {busy ? "Subiendo…" : url ? "" : "+ Foto"}
        </button>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="min-h-11 rounded-lg bg-brand px-4 text-[0.875rem] font-semibold text-white transition hover:bg-brand-dark"
          >
            {url ? "Cambiar foto" : "Subir foto"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="min-h-9 text-left text-[0.8125rem] font-semibold text-ink/55 hover:text-red-600"
            >
              Quitar foto
            </button>
          )}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {value?.src && (
        <div className="mt-1 flex flex-col gap-3">
          <Field
            label="¿Qué se ve en la foto?"
            hint={altHint}
            value={value.alt}
            onChange={(alt) => onChange({ ...value, alt })}
            placeholder="Ej. Pastel de bodas blanco con flores"
          />
          {showFocus && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.8125rem] font-semibold text-ink/70">Si se recorta, mostrar:</span>
              {focusOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={(value.focus ?? "center") === o.value}
                  onClick={() => onChange({ ...value, focus: o.value })}
                  className={`min-h-9 rounded-full px-3 text-[0.8125rem] font-semibold transition ${
                    (value.focus ?? "center") === o.value ? "bg-ink text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-brand/[0.07] px-4 py-3 text-[0.875rem] leading-relaxed text-ink/75">
      <span className="font-semibold text-brand">Consejo: </span>
      {children}
    </p>
  );
}
