# Manual de Bloom Portfolio

**Crea y publica tu portfolio profesional gratis, sin saber programar.**

Bloom es una iniciativa de [Qodira](https://www.qodira.com/es/bloom). Esta guía te acompaña paso a paso: en unos 30 minutos puedes tener tu portfolio en internet, con tu nombre, tus fotos y tu forma de contacto.

---

## Antes de empezar

**Vas a necesitar:**

- Un **correo electrónico**.
- Tus **textos**: quién eres, qué haces, qué ofreces. Puedes escribirlos antes en tus notas del celular.
- Tus **fotos**: una tuya o de tu trabajo para el inicio, y fotos de tus proyectos.
- Tu **número de WhatsApp** o tu email de contacto.

**No vas a necesitar:**

- Instalar programas.
- Pagar nada. Todo lo de esta guía es gratis.
- Saber programar. Solo vas a cambiar textos que están entre comillas.

**Dos servicios gratuitos que vamos a usar:**

| Servicio | Para qué sirve | Una comparación |
|----------|----------------|-----------------|
| **GitHub** | Guarda tu copia del portfolio y sus archivos | Tu "carpeta en la nube" |
| **Vercel** | Publica tu portfolio en internet y lo actualiza cada vez que guardas un cambio | Tu "vitrina" |

---

## Paso 1 · Crea tu cuenta en GitHub

1. Entra a [github.com/signup](https://github.com/signup).
2. Escribe tu correo, crea una contraseña y elige un **nombre de usuaria**. Piénsalo bien, porque aparecerá en algunas direcciones. Por ejemplo: `camilaortega`.
3. Confirma tu correo con el código que te llega.

> Si ya tienes cuenta en GitHub, salta al paso 2.

---

## Paso 2 · Crea tu copia y publícala (un solo botón)

1. Entra a la página de la plantilla en GitHub:
   **[github.com/viviana23/bloom-portfolio](https://github.com/viviana23/bloom-portfolio)**
2. Baja hasta el botón negro **Deploy with Vercel** y haz clic.
3. Vercel te pide entrar: elige **Continue with GitHub** y acepta los permisos.
4. Ponle un nombre a tu proyecto, por ejemplo `portfolio-camila`, y haz clic en **Create**.
5. Espera 1 o 2 minutos. Cuando veas **Congratulations!** y una vista previa de la página, tu portfolio ya está en internet.

Vercel te da una dirección como `portfolio-camila.vercel.app`. Guárdala: ese es tu portfolio.

> En este momento tu portfolio muestra la **demo** (Camila Ortega, la repostera). Es normal: en el siguiente paso la cambias por tu información.

**¿Qué pasó detrás de escena?** Vercel creó en tu cuenta de GitHub una copia de la plantilla que es **tuya**, y la conectó con tu portfolio. Cada vez que cambies algo en esa copia, tu portfolio se actualiza solo en uno o dos minutos.

---

## Paso 3 · Encuentra el archivo que vas a editar

Todo tu portfolio se cambia desde **un solo archivo**: `portfolio.config.ts`.

1. Entra a [github.com](https://github.com) y abre tu repositorio. Así se llama la copia que creó Vercel, por ejemplo `portfolio-camila`.
2. En la lista de archivos, haz clic en **`portfolio.config.ts`**.
3. Arriba a la derecha, haz clic en el **lápiz ✎** ("Edit this file").

Ya estás en modo edición. Verás el archivo dividido en bloques numerados, cada uno con una explicación.

### Las 4 reglas para editar sin romper nada

1. **Cambia solo lo que está entre comillas.** `name: "Camila Ortega"` → `name: "Tu Nombre"`.
2. **No borres las comillas, las comas ni las llaves** `{ }` `[ ]`.
3. **Las líneas que empiezan con `//` son comentarios:** son explicaciones y no se muestran en tu página.
4. **Si un texto lleva comillas por dentro**, usa comillas simples o tipográficas: `"Mi lema es 'hecho con amor'"`.

### Cómo guardar

Cuando termines de editar:

1. Haz clic en el botón verde **Commit changes...** (arriba a la derecha).
2. Escribe una frase corta sobre lo que cambiaste, por ejemplo "Mis textos".
3. Haz clic en **Commit changes**.

En uno o dos minutos tu portfolio se actualiza solo. Recarga la página para ver los cambios.

> **Consejo:** no intentes cambiarlo todo de una vez. Edita un bloque, guarda y revisa cómo quedó. Así, si algo sale mal, sabes exactamente qué fue.

---

## Paso 4 · Tu información (bloques 1 a 4)

### Bloque 1 · Tu sitio

```ts
site: {
  title: "Tu Nombre — Tu profesión",
  description: "Una frase de unos 150 caracteres sobre lo que haces. Es lo que aparece en Google.",
```

- **title** es lo que se lee en la pestaña del navegador y en Google.
- **description** es la frase que aparece debajo del título en Google y al compartir tu enlace.
- **url**: cuando tengas tu dominio propio, escríbelo aquí, por ejemplo `"https://tunombre.com"`. Mientras tanto, déjalo vacío: `""`.

### Bloque 2 · Sobre ti

```ts
person: {
  name: "Tu Nombre",
  role: "Tu profesión · Tu especialidad",
  headline: "Tu frase principal. Usa *asteriscos* para resaltar palabras.",
  location: "Tu ciudad, País",
  availability: "Agenda abierta para nuevos proyectos",
  email: "tu@correo.com",
  whatsapp: "573001234567",
```

- **headline** es la frase grande del inicio. Lo que pongas entre `*asteriscos*` sale en cursiva y en tu color.
- **availability** es el texto del sello que gira sobre tu foto.
- **whatsapp**: escribe tu número con el **código de país y sin el signo +**. Colombia es 57, México 52, Chile 56, Perú 51, Argentina 54 y España 34. Por ejemplo: `"573001234567"`.
  - Con este campo, **todos los botones** de contacto y encargo abren WhatsApp con un mensaje ya escrito.
  - Además aparece un **botón flotante** de WhatsApp en la esquina.
  - Si no quieres usar WhatsApp, deja la línea con `//` delante y los botones usarán tu email.

> **Importante:** en la plantilla la línea de WhatsApp empieza con `//`. **Borra esas dos barras** para activarla, y pon tu número.

### Bloque 3 · Tus redes

```ts
links: [
  { label: "Instagram", url: "https://www.instagram.com/tu_usuario/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/tu-perfil/" },
],
```

- Pon la **dirección completa de tu perfil**. La más fácil de conseguir es abrir tu perfil en el navegador y copiar la dirección de arriba.
- Puedes agregar o quitar redes. Cada red es una línea `{ label: "...", url: "..." },`.

### Bloque 4 · Botones del inicio

```ts
hero: {
  primaryCta: { label: "Ver mi trabajo", url: "#proyectos" },
  secondaryCta: { label: "Contratarme", url: "#servicios" },
  marquee: ["Palabra 1", "Palabra 2", "Palabra 3", "Palabra 4"],
},
```

- **marquee** son las palabras de la cinta que se mueve. Las **3 primeras** salen también como stickers sobre tu foto. Úsalas para tus especialidades.
- Los botones pueden llevar a una sección de tu página: `#proyectos`, `#galeria`, `#servicios`, `#sobre-mi` o `#contacto`.

---

## Paso 5 · Tus fotos

### Cómo subirlas

1. En tu repositorio de GitHub, entra a la carpeta **`public`** y luego a **`fotos`**.
2. Haz clic en **Add file → Upload files**.
3. Arrastra tus fotos y haz clic en **Commit changes**.
4. En `portfolio.config.ts`, escribe la ruta de cada foto: `"/fotos/nombre-de-tu-foto.jpg"`.

### Consejos para que se vean bien

- **Nombres de archivo sin espacios, tildes ni ñ:** `pastel-bodas.jpg` sí, `Pastel de Boda Ñ.jpg` no.
- **Formato JPG, de unos 1600 px de ancho.** No te preocupes por el peso: Bloom las optimiza sola al publicar.
- **Escribe el `alt` de cada foto**: una frase que describa lo que se ve, por ejemplo `"Pastel de bodas blanco de tres pisos con flores"`. Sirve para personas ciegas que usan lector de pantalla y también para Google.
- **Si al recortarse no se ve la parte importante** (por ejemplo, tu cara), agrega `focus`:

```ts
photo: { src: "/fotos/yo.jpg", alt: "Retrato mío sonriendo", focus: "top" },
```

  Puedes usar `"top"` (arriba), `"bottom"` (abajo), `"left"` (izquierda), `"right"` (derecha) o `"center"` (centro).

### Borra las fotos de la demo

Cuando ya tengas las tuyas, borra las de Camila de la carpeta `public/fotos`: entra a cada foto y usa el menú **⋯ → Delete file**. Así tu portfolio no carga fotos que no usas.

> **Ojo:** borra una foto solo cuando ya no aparezca en tu `portfolio.config.ts`. Si el archivo todavía la menciona, la publicación se detiene con el aviso *"No encuentro la imagen…"*. Para comprobarlo, busca el nombre de la foto dentro del archivo con Ctrl + F (o Cmd + F en Mac).

---

## Paso 6 · Elige qué secciones mostrar

No todas tenemos la misma información, y está bien. En el **bloque 5** está la lista de secciones:

```ts
sections: {
  projects: true,      // Proyectos destacados
  gallery: true,       // Galería de fotos
  about: true,         // Sobre mí
  services: true,      // Servicios
  testimonials: false, // ← oculta (todavía no tengo testimonios)
  skills: true,        // Habilidades
  lab: true,           // En proceso
  experience: false,   // ← oculta
  education: true,     // Formación
  contact: true,       // Contacto
},
```

- **`true`** = se muestra · **`false`** = se oculta.
- **Para cambiar el orden**, mueve la línea hacia arriba o hacia abajo.
- El menú, los números de cada sección y los botones se acomodan solos.
- **El menú muestra todas tus secciones activas.** En la computadora, las **4 primeras** quedan a la vista y el resto aparece en el botón **"Más"**. Por eso conviene poner arriba de la lista las secciones más importantes para ti.

### ¿Qué sección es para qué?

| Sección | Úsala si… |
|---------|-----------|
| **Proyectos** (`projects`) | Quieres contar 1 a 6 trabajos con su historia: el reto, lo que hiciste y el resultado. **Es la más importante.** |
| **Galería** (`gallery`) | Tu trabajo es muy visual (repostería, fotografía, uñas, ilustración, decoración). |
| **Servicios** (`services`) | Vendes algo: servicios, paquetes o talleres, con o sin precio. |
| **Testimonios** (`testimonials`) | Tienes comentarios **reales** de clientes. Pide permiso antes de publicarlos. |
| **En proceso** (`lab`) | Estás empezando o aprendiendo: muestra cursos, retos y proyectos personales. En `lookingFor` escribe qué oportunidades buscas. |
| **Experiencia** (`experience`) | Tienes experiencia laboral que quieras mostrar. |
| **Formación** (`education`) | Tienes estudios o certificaciones relevantes. |

> **¿Estás empezando y no tienes clientes todavía?** No pasa nada. Activa **En proceso** y ponla justo después de Proyectos. Muestra tus proyectos de estudio, retos personales o trabajos voluntarios. Un portfolio honesto vale más que uno inflado.

---

## Paso 7 · Tus proyectos y tu contenido

### Agregar un proyecto

Busca el bloque **Proyectos destacados**. Cada proyecto es un bloque entre `{ }`. Para agregar uno:

1. Copia un proyecto completo, desde `{` hasta `},`.
2. Pégalo justo debajo.
3. Cambia sus textos.

Solo **`title`** (título) y **`summary`** (resumen corto) son obligatorios. El resto es opcional y solo aparece si lo completas:

| Campo | Qué escribir |
|-------|--------------|
| `type` | El tipo de trabajo: "Boda", "Cliente", "Proyecto personal" |
| `year` | El año: "2026" |
| `role` | Qué hiciste tú |
| `tools` | Herramientas, ingredientes o técnicas: `["Figma", "Canva"]` |
| `cover` | La foto principal del proyecto |
| `problem` | Cuál era el reto o el encargo |
| `process` | Cómo lo resolviste (puede ser una lista de pasos) |
| `result` | Qué pasó al final, qué aprendiste |
| `outcomes` | Resultados en números: `{ value: "180", label: "invitados" }` |
| `gallery` | Más fotos del proyecto |

### Galería, servicios y testimonios

Todos funcionan igual: son listas. Copia un elemento, pégalo y cambia el texto.

- **Galería:** cada foto necesita `src` y `alt`. El `caption` (una etiqueta corta) es opcional.
- **Servicios:** `name` y `description` son obligatorios. `price`, `details` y `featured: true` (para destacarlo) son opcionales.
- **Testimonios:** `quote` (el comentario), `name` y, si quieres, `context` (qué se le hizo, por ejemplo "Boda, 120 invitados").

---

## Paso 8 · Tu estilo y tus colores

En el bloque **Estilo y colores** eliges el look de tu portfolio con **dos palabras**:

```ts
theme: {
  style: "divertido",
  palette: "fresa",
},
```

**Estilos:**

- **`divertido`** — Alegre y cercano, con bordes marcados y stickers. Ideal para repostería, hecho a mano, belleza, eventos e ilustración.
- **`elegante`** — Líneas finas y letra clásica. Ideal para bodas, bienestar, coaching, arquitectura y moda.
- **`minimal`** — Sobrio y limpio. Ideal para consultoría, psicología, abogacía y tecnología.

**Paletas de color:**

- **`fresa`** — crema, chocolate y fresa
- **`salvia`** — verdes suaves y arena
- **`arena`** — beige y café
- **`lavanda`** — lavanda y tonos creativos
- **`tinta`** — negro y terracota

### ¿No sabes cuál elegir? Recomendaciones según tu profesión

| Si eres… | Estilo | Paleta | Por qué funciona |
|----------|--------|--------|------------------|
| Repostera, pastelera, chocolatera | `divertido` | `fresa` | Alegre y antojable, como una vitrina de dulces |
| Chef, cocina saludable, catering | `divertido` | `salvia` | Fresco y natural, con sabor a ingredientes de temporada |
| Maquilladora, manicurista, estética | `divertido` | `fresa` | Cercano y con mucha personalidad, ideal para mostrar antes y después |
| Ilustradora, artista, tatuadora | `divertido` | `lavanda` | Creativo y juguetón, deja que tus colores brillen |
| Creadora de contenido, community manager, marketing | `divertido` | `lavanda` | Moderno y con energía, se ve bien en redes |
| Artesana, joyería, hecho a mano | `divertido` | `arena` | Cálido y con textura, transmite oficio |
| Profesora, educación infantil, talleres | `divertido` | `salvia` | Amable y tranquilo, genera confianza en las familias |
| Wedding planner, organizadora de eventos | `elegante` | `arena` | Sofisticado y atemporal, habla de detalle y calma |
| Florista, decoradora | `elegante` | `salvia` | Natural y delicado, como un ramo bien armado |
| Instructora de yoga, bienestar, nutricionista | `elegante` | `salvia` | Sereno, respira |
| Coach, mentora, consultora de imagen | `elegante` | `arena` | Cálido y profesional a la vez |
| Estilista, diseñadora de moda | `elegante` | `tinta` | Editorial, con aire de revista |
| Fotógrafa, videógrafa | `minimal` | `tinta` | Neutro, para que tus fotos sean las protagonistas |
| Diseñadora gráfica, diseñadora UX/UI | `minimal` | `lavanda` | Limpio, con un toque de creatividad |
| Desarrolladora, analista de datos, tecnología | `minimal` | `tinta` | Sobrio y directo, muy profesional |
| Psicóloga, terapeuta | `minimal` | `salvia` | Tranquilo y cuidado, sin distracciones |
| Arquitecta, interiorista | `minimal` | `arena` | Ordenado y cálido, como un buen espacio |
| Abogada, contadora, consultora | `minimal` | `arena` | Serio y confiable, sin frialdad |

Son solo puntos de partida: si una combinación no te representa, prueba otra. Guarda, espera un minuto y mira cómo queda.

> **Consejo:** si tu marca ya tiene un color, elige la paleta más parecida y luego cambia solo el acento (te explicamos cómo aquí abajo).

### ¿Quieres tu color de marca exacto?

Escribe solo el color que quieras cambiar, en código hexadecimal (lo encuentras en Canva o en cualquier selector de color):

```ts
theme: {
  style: "elegante",
  palette: "arena",
  light: { accent: "#9C4A6B" },
},
```

---

## Paso 9 · Adapta las palabras a tu oficio

Al final del archivo está el bloque **Textos de la interfaz** (`labels`). Ahí cambias las palabras del menú y de los títulos para que hablen como tu negocio:

```ts
labels: {
  navProjects: "Sesiones",           // en el menú, en lugar de "Proyectos"
  titleServices: "Mis *paquetes*",   // título de la sección de servicios
  askService: "Reservar",            // botón de cada servicio
},
```

Algunas ideas según el oficio:

- **Fotógrafa:** Proyectos → "Sesiones" · Servicios → "Paquetes"
- **Coach o terapeuta:** Proyectos → "Casos" · Servicios → "Programas"
- **Diseñadora:** Proyectos → "Casos de estudio"
- **Repostera:** Proyectos → "Creaciones" · Servicios → "Encargos"

---

## Paso 10 · Revisión final antes de compartir

- [ ] Tu nombre, tu frase y tus textos (ya no dice "Camila Ortega")
- [ ] Tu email y tu WhatsApp **reales**
- [ ] Los enlaces de tus redes llevan a **tu perfil**, no a la página principal de la red
- [ ] Tus fotos, con su `alt`
- [ ] Borraste las fotos de la demo
- [ ] Solo los testimonios que son reales
- [ ] **La imagen para redes** (`public/og-image.png`): es la imagen que aparece cuando compartes tu enlace por WhatsApp o redes. Reemplázala por una tuya de 1200 × 630 px (en Canva, usa el tamaño "Publicación de Facebook"). Si no tienes una, borra la línea `ogImage` del bloque 1.
- [ ] Abriste tu portfolio en el **celular** y en la computadora

> **Aviso útil:** mientras quede contenido de la demo (el nombre Camila, el email de ejemplo o la imagen para redes), Bloom te lo avisa en el registro de publicación de Vercel.

---

## Si algo sale mal

### Mi portfolio no se actualizó

1. En [vercel.com](https://vercel.com), abre tu proyecto y entra a **Deployments**.
2. Mira el último:
   - **Ready** (verde): se publicó bien. Recarga tu página con Ctrl + F5 (o Cmd + Shift + R en Mac).
   - **Building**: espera un minuto más.
   - **Error** (rojo): haz clic en él y busca el mensaje que empieza con **✕**. Te explica en español qué corregir.

### Los mensajes de error más comunes

| El mensaje dice… | Qué pasó | Cómo arreglarlo |
|------------------|----------|-----------------|
| `No encuentro la imagen "/fotos/…"` | La foto no está en `public/fotos` o el nombre no coincide | Revisa que el nombre sea exactamente igual, con mayúsculas y extensión (`.jpg`) |
| `La imagen de … no tiene texto alternativo` | Falta el `alt` o está vacío | Escribe una frase que describa la foto |
| `El estilo "…" no existe` o `La paleta "…" no existe` | Hay un error de escritura | Usa una de las opciones que te muestra el mensaje |
| `El WhatsApp "…" no parece válido` | Falta el código de país o sobran números | Escríbelo así: `"573001234567"` |
| `PARSE_ERROR` · `Expected "," …` con `portfolio.config.ts:43` | Falta una coma, una comilla o una llave | Ve a la **línea 43** (el número que aparece) o a la anterior, y revisa comas y comillas |

### Lo arreglé mal y no sé volver atrás

GitHub guarda todas tus versiones.

1. En tu repositorio, entra a `portfolio.config.ts` y haz clic en **History**.
2. Abre la última versión que funcionaba y copia su contenido.
3. Pégalo en el archivo y guarda.

---

## Extra · Tu propio dominio (opcional)

¿Quieres que tu portfolio sea `tunombre.com` en lugar de `….vercel.app`?

1. Compra un dominio. Cuesta entre 10 y 15 USD al año en Namecheap, GoDaddy o Porkbun.
2. En Vercel, abre tu proyecto y entra a **Settings → Domains → Add**.
3. Sigue las instrucciones para conectarlo.
4. Escribe tu dominio en `site.url` del bloque 1. Así Google lo muestra correctamente.

---

## Comparte tu portfolio con nosotras

Cuando publiques tu portfolio, **etiquétanos** y cuéntanos. Nos encanta ver lo que construyes, y podemos mostrarlo en la galería de portfolios hechos con Bloom.

¿Tienes dudas? Encuéntranos en [qodira.com/es/bloom](https://www.qodira.com/es/bloom).

*Bloom es una iniciativa de [Qodira](https://www.qodira.com/). Tu trabajo merece ser visto.*
