                                                                                      # Bloom Portfolio

**Tu trabajo merece ser visto.** Una plantilla gratuita de portfolio de **[Bloom](https://www.qodira.com/es/bloom), una iniciativa de [Qodira](https://www.qodira.com/)**.

Todo tu contenido vive en un solo archivo: `portfolio.config.ts`. No hace falta tocar componentes, estilos ni HTML.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fviviana23%2Fbloom-portfolio&project-name=mi-portfolio&repository-name=mi-portfolio)

**¿No programas?** Sigue el **[manual paso a paso](docs/MANUAL.md)**: en 30 minutos tienes tu portfolio publicado, gratis y sin instalar nada.

---

## Convertir esta plantilla en tu portfolio

### Opción A · Sin instalar nada (recomendada si no programas)

Solo necesitas una cuenta de GitHub y otra de Vercel o Netlify (las dos son gratuitas).

1. **Copia y publica la plantilla.** Pulsa el botón **Deploy with Vercel** de arriba: crea tu copia en GitHub y la publica en un solo paso. También puedes usar **Use this template → Create a new repository** en GitHub.
2. **Edita tu contenido.** Abre `portfolio.config.ts` en GitHub, pulsa el lápiz ✎, reemplaza los textos y guarda con **Commit changes**.
3. **Sube tus imágenes.** Entra en la carpeta `public/proyectos`, pulsa **Add file → Upload files** y súbelas. Luego escribe su ruta en el config, por ejemplo `"/proyectos/mi-app.jpg"`.
4. **Publica.** En [vercel.com](https://vercel.com) pulsa **Add New → Project** e importa tu repositorio. Vercel detecta la configuración sola. Cada vez que guardes un cambio en GitHub, tu portfolio se actualiza solo.

Si algo está mal escrito, la publicación se detiene y el registro de Vercel te dice qué corregir, en español. Por ejemplo: *No encuentro la imagen "/proyectos/app.jpg". Debe estar en la carpeta public/proyectos/app.jpg.*

### Opción B · En tu computadora

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev        # abre http://localhost:5173 y se actualiza al guardar
npm run build      # genera la versión final en /dist
```

Usa VS Code o Cursor: al editar `portfolio.config.ts`, el editor autocompleta los campos y subraya los errores.

---

## Qué cambiar en `portfolio.config.ts`

El archivo está numerado de arriba abajo:

| # | Bloque | Qué es |
|---|--------|--------|
| 1 | `site` | Título y descripción para Google, imagen para redes, tu dominio |
| 2 | `person` | Nombre, rol, frase principal, ubicación, disponibilidad, foto, email, CV |
| 3 | `links` | Redes y perfiles (agrega o quita los que quieras) |
| 4 | `hero` | Los dos botones principales y las palabras de la cinta |
| 5 | `sections` | **Qué secciones se muestran** (`true`/`false`) y en qué orden |
| 6–15 | Secciones | Sobre mí, Galería, Servicios, Testimonios, Habilidades, Proyectos, En proceso, Experiencia, Formación, Contacto |
| 16 | `theme` | Tu estilo (`style`) y tu paleta de colores (`palette`) |
| 17 | `labels` | Palabras del menú y de los títulos, para adaptarlos a tu oficio |

### Botones de contacto: email o WhatsApp

No necesitas configurar los botones uno por uno. Todos los de **encargo, servicios y contacto** salen de dos campos de `person`:

```ts
email: "hola@tunegocio.com",
whatsapp: "573001234567", // código de país + número, sin "+" ni espacios
```

- **Con `whatsapp`:** todos abren WhatsApp con un mensaje ya escrito. Por ejemplo, el botón de un servicio escribe *"Hola, vi tu portfolio y quiero información sobre: Bodas y eventos"*.
- **Sin `whatsapp`:** abren un email, con el nombre del servicio en el asunto.
- Tu email se sigue mostrando en la tarjeta de contacto, con un botón para copiarlo.
- **Botón flotante:** con `whatsapp`, aparece un botón redondo con el ícono de WhatsApp, en tu color de acento, mientras la persona navega. Queda pegado al borde derecho de la pantalla, se esconde en el inicio y al llegar a la sección de contacto, para no repetir botones. Sin WhatsApp, el botón es de email. Para quitarlo, pon `site.floatingButton: false`.

¿Quieres que un botón en particular haga otra cosa, como agendar una llamada? Ponle `cta: { label: "Agenda una llamada", url: "https://..." }` a ese servicio o al contacto. Los mensajes de WhatsApp se cambian en `labels` (`whatsappHello` y `whatsappAbout`).

### Agregar un proyecto

Copia un bloque `{ … }` dentro de `projects.items`, pégalo debajo y cambia el contenido. Solo son obligatorios `title` y `summary`:

```ts
{
  title: "Mi primer proyecto",
  summary: "Qué es, en una o dos frases.",
},
```

Todo lo demás es opcional y se muestra solo si lo completas: `type`, `year`, `role`, `tools`, `cover`, `problem`, `process`, `result`, `outcomes`, `gallery` y `links`. La retícula se adapta a 1, 2, 3 o 6 proyectos. Si un proyecto no tiene imagen, la tarjeta se muestra en versión tipográfica.

Cada proyecto tiene su propio enlace para compartir, por ejemplo `tudominio.com/#proyecto/mi-primer-proyecto`.

### Mostrar u ocultar secciones

No todas tenemos la misma información para mostrar, y está bien. En `sections` cada sección tiene un interruptor:

```ts
sections: {
  projects: true,      // se muestra
  gallery: true,
  about: true,
  services: false,     // ← oculta
  testimonials: false, // ← oculta
  contact: true,
},
```

- `true` la muestra y `false` la oculta.
- **El orden de la lista es el orden en la página.** Para mover una sección, sube o baja su línea.
- Todo se ajusta solo: la numeración de las secciones, el menú y los botones. Si ocultas "servicios", el botón del inicio que llevaba ahí desaparece.
- Si una sección está en `true` pero no tiene contenido (por ejemplo, `items: []`), no se muestra y al compilar recibes un aviso. Nunca aparecen mensajes como "sin experiencia".

¿Estás empezando? Pon `lab: true` ("En proceso") justo después de `projects`. Ahí cuentas tus cursos, retos y experimentos, y en `lookingFor` escribes qué oportunidades buscas (clientes, alianzas, empleo): aparece destacado con un botón de contacto que ya menciona esa búsqueda. Si tu negocio ya está establecido, puedes ocultarla con `lab: false`. Oculta `experience` si todavía no tienes experiencia laboral.

### Elegir estilo y colores

Tu look se elige con dos palabras en `theme`:

```ts
theme: {
  style: "divertido",
  palette: "fresa",
},
```

**Estilos** (el carácter del sitio):

| Estilo | Cómo se ve | Ideal para |
|--------|-----------|------------|
| `divertido` | Bordes marcados, sombras de sticker, elementos girados, cinta de color | Repostería, hecho a mano, ilustración, belleza, eventos, contenido |
| `elegante` | Líneas finas, sin sombras ni giros, serif clásica | Bodas, bienestar, coaching, arquitectura, interiorismo, moda |
| `minimal` | Sobrio, tipografía sans, sin decoraciones | Consultoría, abogacía, psicología, tecnología, perfiles corporativos |

**Paletas** (cada una trae versión clara y oscura):

| Paleta | Colores | Ideal para |
|--------|---------|------------|
| `fresa` | Crema, chocolate y fresa | Repostería, cocina, dulces, eventos |
| `salvia` | Verde salvia y arena | Bienestar, yoga, nutrición, plantas |
| `arena` | Beige y cognac | Coaching, arquitectura, bodas, interiorismo |
| `lavanda` | Lavanda y tonos creativos | Ilustración, diseño, educación, contenido |
| `tinta` | Negro y terracota | Fotografía, moda, consultoría, tecnología |

Cualquier estilo funciona con cualquier paleta. Por ejemplo, una fotógrafa podría usar `minimal` + `tinta` y una coach, `elegante` + `salvia`.

**¿Quieres ajustar un color?** Escribe solo ese color y se aplica encima de la paleta:

```ts
theme: {
  style: "elegante",
  palette: "arena",
  light: { accent: "#9C4A6B" }, // tu color de marca
},
```

Colores disponibles: `background`, `foreground`, `accent`, `muted`, `border` y `blocks`, que son los 4 colores de tarjetas y stickers. El color del texto encima de cada color se elige solo, y al compilar Bloom te avisa si algo tiene poco contraste. Si escribes mal el nombre de una paleta o de un estilo, tu editor lo subraya y el mensaje te dice cuáles existen.

### Resaltar palabras

En `person.headline`, en `contact.title` y en los títulos de sección, escribe una palabra entre asteriscos (`*así*`) y aparecerá en cursiva serif con tu color de acento. Tu apellido se muestra en cursiva automáticamente.

### Foto, monograma y cinta

- **Fotos:** hay tres lugares opcionales para fotos sueltas: `person.photo` (el arco del hero), `about.photo` ("Sobre mí") y `contact.photo` (una polaroid junto al contacto). Guárdalas en `public/fotos` y usa JPG de unos 1600 px de ancho. Si al recortarse no se ve la parte importante (por ejemplo, tu cara), agrega `focus: "top"` o `focus: "left"` a esa foto.
- **Foto del hero:** con `person.photo` se muestra dentro del arco. Si no tienes foto, el arco muestra tus iniciales en cursiva.
- **Stickers:** las tres primeras palabras de `hero.marquee` aparecen como stickers alrededor del arco.
- **Cinta:** `hero.marquee` es la lista de palabras que pasa lentamente bajo el hero. Borra la lista para ocultarla.

### Galería, servicios y testimonios

- **Galería** (`gallery`): tus mejores fotos en un mosaico que se acomoda solo a cualquier cantidad. Al hacer clic se abren en grande y se navegan con las flechas del teclado. Cada foto lleva `alt` (qué se ve) y, si quieres, `caption` (una etiqueta corta).
- **Servicios** (`services`): lo que ofreces, con precio opcional y una lista de lo que incluye. Marca uno con `featured: true` para destacarlo. El botón abre un email con el nombre del servicio, o el enlace que pongas en `cta` (por ejemplo, WhatsApp).
- **Testimonios** (`testimonials`): frases de clientes o colegas, con nombre y contexto. **Usa solo testimonios reales.**

### Adaptarlo a tu oficio

La demo es de una repostera, pero la estructura sirve para cualquier trabajo. Cambia las palabras del menú y de los títulos en `labels`:

```ts
labels: {
  navProjects: "Creaciones",       // en el menú
  titleServices: "Encargos y *servicios*",
  problem: "El encargo",           // títulos dentro de cada proyecto
  process: "Cómo lo hice",
  result: "El resultado",
},
```

Algunas ideas:
- **Fotógrafa:** "Sesiones" en lugar de proyectos, galería al principio y servicios con paquetes.
- **Diseñadora o desarrolladora:** "Casos de estudio", sin galería y con el laboratorio para proyectos personales.
- **Ilustradora:** galería primero, luego "Encargos" y testimonios.

### Portfolio en otro idioma

Cambia `site.lang` y sobrescribe los textos de la interfaz en `labels`:

```ts
labels: { navProjects: "Work", titleProjects: "Selected work", writeMe: "Email me" },
```

### Antes de publicar

Al compilar, Bloom te avisa si todavía tienes contenido de la demo: el nombre, el email de ejemplo o la imagen para redes. Reemplaza también:

- `public/og-image.png`: imagen de 1200×630 que se ve al compartir tu enlace. Si no tienes una, borra `ogImage`.
- `site.url`: tu dominio final. Activa la URL canónica, `sitemap.xml` y `robots.txt`.

---

## Arquitectura

```
portfolio.config.ts          ← tu contenido (el único archivo que editas)
public/fotos/                ← fotos (galería, proyectos, hero)
public/                      ← CV, og-image
src/
  lib/types.ts               ← contrato del contenido (autocompletado y validación)
  lib/content.ts             ← normaliza: textos por defecto, slugs, secciones visibles
  lib/hooks.ts               ← tema, animación de entrada, sección activa
  components/                ← Header, Hero, Projects, ProjectDialog, Sections, Extras (galería, servicios, testimonios), Contact
  lib/themes.ts              ← paletas y estilos listos (fresa, salvia, arena, lavanda, tinta)
  styles.css                 ← sistema visual: variables de cada estilo, tipografía, botones
scripts/
  vite-plugin-bloom.ts       ← SEO, colores, favicon, sitemap y validación desde el config
  prerender.js               ← genera HTML estático con todo el contenido
```

- **React + TypeScript + Vite + Tailwind CSS 4.** Sin backend.
- **Pre-renderizado (SSG):** el HTML final ya incluye todo el texto. Google y las redes lo leen sin ejecutar JavaScript, y la página se ve incluso si JavaScript falla.
- **SEO desde el config:** title, description, Open Graph, Twitter Card, canonical, author, favicon (se genera con tus iniciales si no pones uno) y datos estructurados `Person` (JSON-LD).
- **Tema claro, oscuro y sistema,** sin parpadeo al cargar. El modo oscuro tiene superficies y acentos propios.
- **Accesibilidad:** HTML semántico, enlace para saltar al contenido, foco visible, diálogos nativos (foco atrapado y tecla Escape), anuncio de enlaces externos, `alt` obligatorio y respeto de `prefers-reduced-motion`.
- **Tipografías locales** (Fraunces y Geist): sin peticiones a servicios externos.

Hecho con cuidado por [Qodira](https://www.qodira.com/) · Bloom es una iniciativa de Qodira.

---

## Créditos de las fotos de la demo

Las fotos de la demo son de [Unsplash](https://unsplash.com) y se usan bajo la [Licencia de Unsplash](https://unsplash.com/license): uso gratuito, también comercial. **Reemplázalas por fotos de tu propio trabajo.**

| Archivo | Foto original |
|---------|---------------|
| `camila-cocina.jpg` | [unsplash.com/photos/-tDD4bRIfbQ](https://unsplash.com/photos/-tDD4bRIfbQ) |
| `croissant-manos.jpg` | [unsplash.com/photos/v7kh-ashaDs](https://unsplash.com/photos/v7kh-ashaDs) |
| `pastel-bodas.jpg` | [unsplash.com/photos/Xb5c2x6wJPc](https://unsplash.com/photos/Xb5c2x6wJPc) |
| `pastel-bodas-2.jpg` | [unsplash.com/photos/HBETvpRcRgA](https://unsplash.com/photos/HBETvpRcRgA) |
| `macarons.jpg` | [unsplash.com/photos/cSzyY2UaFSI](https://unsplash.com/photos/cSzyY2UaFSI) |
| `macarons-torre.jpg` | [unsplash.com/photos/jN1C3-edaro](https://unsplash.com/photos/jN1C3-edaro) |
| `macarons-rosas.jpg` | [unsplash.com/photos/pXEsx3kRuNc](https://unsplash.com/photos/pXEsx3kRuNc) |
| `croissants-bandeja.jpg` | [unsplash.com/photos/sqkXyyj4WdE](https://unsplash.com/photos/sqkXyyj4WdE) |
| `croissants.jpg` | [unsplash.com/photos/4WuNM9Qcjpo](https://unsplash.com/photos/4WuNM9Qcjpo) |
| `croissants-cafe.jpg` | [unsplash.com/photos/AEEXmjO8GzE](https://unsplash.com/photos/AEEXmjO8GzE) |
| `torta-chocolate.jpg` | [unsplash.com/photos/P_l1bJQpQF0](https://unsplash.com/photos/P_l1bJQpQF0) |
| `torta-cacao.jpg` | [unsplash.com/photos/_y5CCcYWTjU](https://unsplash.com/photos/_y5CCcYWTjU) |
| `cheesecakes.jpg` | [unsplash.com/photos/Lszovjil4B8](https://unsplash.com/photos/Lszovjil4B8) |
| `cupcake-rosa.jpg` | [unsplash.com/photos/zEwgRzJJIvk](https://unsplash.com/photos/zEwgRzJJIvk) |
| `cupcakes-caja.jpg` | [unsplash.com/photos/zURPcpLoKA4](https://unsplash.com/photos/zURPcpLoKA4) |

---

## Licencia

[MIT](LICENSE): puedes usar, copiar, modificar y publicar esta plantilla gratis, también para tu negocio. Solo conserva el aviso de autoría del archivo `LICENSE`. Si mantienes la línea "Hecho con Bloom, una iniciativa de Qodira" al final de tu portfolio, nos ayudas a que más mujeres la encuentren.
