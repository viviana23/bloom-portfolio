import { Card, Field, ImagePicker, TextArea, Tip } from "../ui/fields";
import { sectionSwitch, type StepProps } from "./shared";

export function AboutStep({ editor, ctx, prof }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  const about = c.about ?? { text: [""] };
  const paragraphs = Array.isArray(about.text) ? about.text : [about.text];
  const points = about.points ?? [];
  const pointLabels = ["Qué hago", "Qué me inspira", "Hacia dónde voy"];

  return (
    <div className="flex flex-col gap-5">
      <Card id="card-inicio" title="Tu presentación" description="Es lo primero que ven: tu nombre, a qué te dedicas y una frase que te represente.">
        <Field label="Tu nombre" value={c.person.name} onChange={(v) => update((d) => void (d.person.name = v))} placeholder="Ej. Camila Ortega" />
        <Field
          label="A qué te dedicas"
          hint="Corto y claro. Puedes separar con un punto medio (·)."
          value={c.person.role}
          onChange={(v) => update((d) => void (d.person.role = v))}
          placeholder={prof?.role}
        />
        <TextArea
          label="Tu frase principal"
          hint={<>Una o dos líneas sobre lo que haces y para quién. Pon entre *asteriscos* las palabras que quieras destacar en color.</>}
          value={c.person.headline}
          onChange={(v) => update((d) => void (d.person.headline = v))}
          placeholder={prof?.headline}
          rows={2}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ciudad y país" value={c.person.location} onChange={(v) => update((d) => void (d.person.location = v))} placeholder="Ej. Medellín, Colombia" />
          <Field
            label="Tu disponibilidad"
            hint="Aparece en el sello giratorio."
            value={c.person.availability}
            onChange={(v) => update((d) => void (d.person.availability = v))}
            placeholder="Ej. Agenda abierta"
          />
        </div>
        <ImagePicker
          label="Tu foto principal"
          hint="Una foto tuya o de tu trabajo. Si no tienes, se muestran tus iniciales."
          value={c.person.photo}
          onChange={(img) => update((d) => void (d.person.photo = img))}
          ctx={ctx}
          showFocus
        />
        <Field
          label="Tus especialidades (3 a 5 palabras)"
          hint="Sepáralas con comas. Las 3 primeras salen como stickers sobre tu foto."
          value={(c.hero?.marquee ?? []).join(", ")}
          onChange={(v) =>
            update((d) => {
              d.hero = { ...d.hero, marquee: v.split(",").map((s) => s.trimStart()) };
            })
          }
          placeholder="Ej. Pasteles de boda, Macarons, Talleres"
        />
      </Card>

      <Card id="card-sobre-mi" title="Sobre mí" description="Cuéntales quién eres, en pocas líneas." {...sectionSwitch(editor, "about")}>
        <TextArea
          label="Primer párrafo"
          hint="Quién eres y qué haces. Se muestra en letra grande."
          value={paragraphs[0]}
          onChange={(v) => update((d) => void (d.about = { ...about, text: [v, paragraphs[1] ?? ""] }))}
          placeholder="Ej. Aprendí a hornear en la cocina de mi abuela y hoy tengo mi propio obrador."
        />
        <TextArea
          label="Segundo párrafo (opcional)"
          value={paragraphs[1]}
          onChange={(v) => update((d) => void (d.about = { ...about, text: [paragraphs[0] ?? "", v] }))}
          placeholder="Ej. Trabajo con ingredientes de temporada. Cada pastel empieza con una conversación."
        />
        <ImagePicker label="Foto para esta sección (opcional)" value={about.photo} onChange={(img) => update((d) => void (d.about = { ...about, photo: img }))} ctx={ctx} showFocus />
        <div className="flex flex-col gap-4">
          <p className="text-[0.875rem] font-semibold text-ink">Tres tarjetas cortas (opcional)</p>
          {pointLabels.map((label, i) => (
            <Field
              key={label}
              label={label}
              value={points.find((p) => p.label === label)?.text}
              onChange={(v) =>
                update((d) => {
                  const list = (d.about?.points ?? []).filter((p) => p.label !== label);
                  list.push({ label, text: v });
                  list.sort((a, b) => pointLabels.indexOf(a.label) - pointLabels.indexOf(b.label));
                  d.about = { ...about, points: list };
                })
              }
              placeholder={["Ej. Pasteles por encargo y talleres.", "Ej. Las frutas de mi tierra.", "Ej. Abrir mi propio salón de té."][i]}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

const countries = [
  { code: "57", name: "Colombia" },
  { code: "52", name: "México" },
  { code: "56", name: "Chile" },
  { code: "51", name: "Perú" },
  { code: "54", name: "Argentina" },
  { code: "593", name: "Ecuador" },
  { code: "58", name: "Venezuela" },
  { code: "507", name: "Panamá" },
  { code: "506", name: "Costa Rica" },
  { code: "598", name: "Uruguay" },
  { code: "34", name: "España" },
  { code: "1", name: "Estados Unidos" },
];

const networks = [
  { label: "Instagram", placeholder: "https://www.instagram.com/tu_usuario" },
  { label: "TikTok", placeholder: "https://www.tiktok.com/@tu_usuario" },
  { label: "Facebook", placeholder: "https://www.facebook.com/tu_pagina" },
  { label: "LinkedIn", placeholder: "https://www.linkedin.com/in/tu-perfil" },
  { label: "YouTube", placeholder: "https://www.youtube.com/@tu_canal" },
  { label: "Pinterest", placeholder: "https://www.pinterest.com/tu_usuario" },
  { label: "Behance", placeholder: "https://www.behance.net/tu_usuario" },
  { label: "Mi tienda o web", placeholder: "https://…" },
];

export function ContactStep({ editor, ctx }: StepProps) {
  const c = editor.state!.config;
  const update = editor.update;
  const wa = c.person.whatsapp ?? "";
  const country = countries.find((k) => wa.startsWith(k.code))?.code ?? "57";
  const local = wa.startsWith(country) ? wa.slice(country.length) : wa;
  const digits = local.replace(/\D/g, "");
  const waError = digits && (digits.length < 7 || digits.length > 12) ? "Revisa el número: escribe solo tu celular, sin el código del país." : undefined;
  const email = c.person.email ?? "";
  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Este correo no parece válido." : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Card id="card-contacto-datos" title="¿Cómo te contactan?" description="Con tu WhatsApp, todos los botones abren un chat con un mensaje ya escrito.">
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.875rem] font-semibold text-ink">Tu WhatsApp</span>
          <div className="flex gap-2">
            <select
              aria-label="País"
              value={country}
              onChange={(e) => update((d) => void (d.person.whatsapp = digits ? e.target.value + digits : ""))}
              className="rounded-xl border border-line bg-white px-3 text-[0.9375rem] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
            >
              {countries.map((k) => (
                <option key={k.code} value={k.code}>
                  {k.name} (+{k.code})
                </option>
              ))}
            </select>
            <div className="flex-1">
              <Field
                label="Número de celular"
                type="tel"
                value={local}
                onChange={(v) => update((d) => void (d.person.whatsapp = v.replace(/\D/g, "") ? country + v.replace(/\D/g, "") : ""))}
                placeholder="Ej. 3001234567"
                error={waError}
              />
            </div>
          </div>
        </div>
        <Field
          label="Tu correo"
          type="email"
          hint="Se muestra en tu portfolio con un botón para copiarlo."
          value={email}
          onChange={(v) => update((d) => void (d.person.email = v.trim()))}
          placeholder="hola@tunegocio.com"
          error={emailError}
        />
      </Card>

      <Card id="card-redes" title="Tus redes" description="Pega el enlace de tu perfil. Deja vacías las que no uses.">
        {networks.map((n) => (
          <Field
            key={n.label}
            label={n.label}
            type="url"
            value={c.links.find((l) => l.label === n.label)?.url}
            onChange={(v) =>
              update((d) => {
                const others = d.links.filter((l) => l.label !== n.label);
                const url = v.trim() && !/^https?:\/\//.test(v.trim()) ? `https://${v.trim()}` : v.trim();
                const list = url ? [...others, { label: n.label, url }] : others;
                d.links = networks.flatMap((x) => list.filter((l) => l.label === x.label));
              })
            }
            placeholder={n.placeholder}
          />
        ))}
        <Tip>Para copiar el enlace, abre tu perfil en el navegador y copia la dirección de arriba.</Tip>
      </Card>

      <Card id="card-contacto" title="Mensaje de cierre" description="La última sección de tu portfolio: una invitación a escribirte." {...sectionSwitch(editor, "contact")}>
        <Field
          label="Título"
          hint="Usa *asteriscos* para destacar una palabra."
          value={c.contact?.title}
          onChange={(v) => update((d) => void (d.contact = { ...d.contact, title: v }))}
          placeholder="¿Tienes algo *especial* en mente?"
        />
        <TextArea
          label="Texto"
          value={c.contact?.text}
          onChange={(v) => update((d) => void (d.contact = { ...d.contact, text: v }))}
          placeholder="Cuéntame qué necesitas y te respondo lo antes posible."
        />
        <ImagePicker label="Foto pequeña tipo polaroid (opcional)" value={c.contact?.photo} onChange={(img) => update((d) => void (d.contact = { ...d.contact, photo: img }))} ctx={ctx} />
      </Card>
    </div>
  );
}
