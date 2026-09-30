/**
 * ─────────────────────────────────────────────────────────────
 *  BLOOM PORTFOLIO · una iniciativa de Qodira (qodira.com)
 *  Tu trabajo merece ser visto.
 * ─────────────────────────────────────────────────────────────
 *
 *  Este es el ÚNICO archivo que necesitas editar.
 *
 *  Todo lo que ves abajo es contenido de DEMOSTRACIÓN: una repostera
 *  ficticia llamada Camila Ortega. Reemplázalo por el tuyo.
 *  Sirve para cualquier oficio: diseño, tecnología, fotografía,
 *  repostería, ilustración, marketing…
 *
 *  Reglas simples:
 *  · Los textos van entre comillas: "así".
 *  · Si un campo tiene "?" en su descripción es opcional: puedes borrarlo.
 *  · Si una sección no aplica para ti, ponla en `false` en `sections`.
 *  · Si una lista está vacía ([]), su sección no se muestra.
 *  · Las imágenes van en la carpeta /public (ej. /public/fotos).
 *
 *  Al guardar, tu editor te avisará si algo no está bien escrito.
 */

import { definePortfolio } from "./src/lib/types.ts";

export default definePortfolio({
  // ── 1. Tu sitio (SEO y redes) ────────────────────────────────
  site: {
    lang: "es",
    url: "", // ← tu dominio final, ej. "https://tunombre.com"
    title: "Camila Ortega — Pastelería de autor",
    description:
      "Pasteles de boda, macarons y laminados hechos a mano en Medellín. Encargos para celebraciones, cafeterías y eventos.",
    ogImage: "/og-image.png",
    favicon: "", // vacío = se genera con tus iniciales y tu color de acento
    showCredit: true, // "Hecho con Bloom, una iniciativa de Qodira" al final de la página
    floatingButton: true, // botón flotante de WhatsApp (o email si no pones WhatsApp)
  },

  // ── 2. Sobre ti ──────────────────────────────────────────────
  person: {
    name: "Camila Ortega",
    role: "Repostera · Pastelería de autor",
    headline: "Pasteles hechos a mano para celebraciones que merecen *recordarse por el sabor*.",
    location: "Medellín, Colombia",
    availability: "Agenda abierta para bodas 2027",
    // Foto dentro del arco del hero: tu retrato o tu trabajo.
    // `focus` elige qué parte se ve al recortarla: "top", "center", "left"…
    photo: {
      src: "/fotos/camila-cocina.jpg",
      alt: "Camila sonriendo en su cocina, apoyada en la mesa junto a un pastel bajo una campana de vidrio",
      focus: "40% 30%",
    },
    email: "hola@example.com",
    // Pon tu WhatsApp y TODOS los botones de encargo y contacto lo usarán,
    // con un mensaje ya escrito. Con código de país y sin espacios:
    // whatsapp: "573001234567",
    // resume: { label: "Descargar catálogo", url: "/catalogo.pdf" },
  },

  // ── 3. Redes y perfiles ──────────────────────────────────────
  // Demo: enlaces a la página principal de cada red. Pon la URL de tu perfil.
  links: [
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "TikTok", url: "https://www.tiktok.com/" },
    { label: "Pinterest", url: "https://www.pinterest.com/" },
  ],

  // ── 4. Botones principales ───────────────────────────────────
  hero: {
    primaryCta: { label: "Ver creaciones", url: "#proyectos" },
    secondaryCta: { label: "Hacer un encargo", url: "#servicios" },
    // Palabras de la cinta. Las 3 primeras también salen como stickers en el hero.
    marquee: ["Pasteles de boda", "Macarons", "Laminados", "Chocolate de origen", "Talleres"],
  },

  // ── 5. Secciones: cuáles se muestran y en qué orden ─────────
  // true = se muestra · false = se oculta.
  // Para cambiar el orden, mueve la línea hacia arriba o hacia abajo.
  sections: {
    projects: true, //      Creaciones / proyectos destacados
    gallery: true, //       Galería de fotos
    about: true, //         Sobre mí
    services: true, //      Encargos y servicios
    testimonials: true, //  Lo que dicen
    skills: true, //        Técnicas / habilidades
    lab: true, //           En proceso: lo que buscas y en qué trabajas
    experience: true, //    Experiencia
    education: true, //     Formación
    contact: true, //       Contacto
  },

  // ── 6. Sobre mí ──────────────────────────────────────────────
  about: {
    text: [
      "Aprendí a hornear en la cocina de mi abuela y me formé como pastelera en hoteles. Hoy tengo mi propio obrador.",
      "Trabajo con ingredientes de temporada, chocolate colombiano de origen y muy poca azúcar. Cada pastel empieza con una conversación.",
    ],
    photo: { src: "/fotos/croissant-manos.jpg", alt: "Manos sosteniendo un croissant recién horneado" },
    points: [
      { label: "Qué hago", text: "Pasteles de celebración, macarons y laminados por encargo." },
      { label: "Qué me inspira", text: "Las frutas colombianas y la pastelería francesa clásica." },
      { label: "Hacia dónde voy", text: "Abrir un pequeño salón de té con talleres los fines de semana." },
    ],
  },

  // ── 7. Galería ───────────────────────────────────────────────
  // Tus mejores fotos. El mosaico se acomoda solo a cualquier cantidad.
  gallery: {
    intro: "Lo que sale del horno esta temporada.",
    items: [
      { src: "/fotos/macarons-rosas.jpg", alt: "Macarons rosados junto a rosas sobre un fondo rosa", caption: "Mesa de postres" },
      { src: "/fotos/pastel-bodas-2.jpg", alt: "Pastel de bodas blanco de cuatro pisos decorado con rosas blancas", caption: "Boda en jardín" },
      { src: "/fotos/cupcake-rosa.jpg", alt: "Cupcake con crema rosa, cereza y chispas de colores", caption: "Cupcakes" },
      { src: "/fotos/torta-chocolate.jpg", alt: "Porción de torta de chocolate de varias capas en un plato blanco", caption: "Chocolate 70 %" },
      { src: "/fotos/croissants-cafe.jpg", alt: "Croissants junto a una taza roja de café sobre la mesa de la cocina", caption: "Desayunos" },
      { src: "/fotos/cheesecakes.jpg", alt: "Mini cheesecakes con frutos rojos y chocolate en una bandeja", caption: "Mini cheesecakes" },
      { src: "/fotos/cupcakes-caja.jpg", alt: "Caja con cupcakes decorados en tonos pastel", caption: "Cajas de regalo" },
      { src: "/fotos/torta-cacao.jpg", alt: "Torta de cacao espolvoreada con azúcar sobre una mesa de madera", caption: "Torta de cacao" },
    ],
  },

  // ── 8. Servicios / encargos ──────────────────────────────────
  // El botón de cada servicio abre tu WhatsApp (o tu email) con el nombre del servicio.
  // Para usar otro enlace en uno en particular, agrégale `cta: { label, url }`.
  services: {
    intro: "Encargos con al menos tres semanas de anticipación. Envíos en Medellín y el Valle de Aburrá.",
    items: [
      {
        name: "Pasteles de celebración",
        description: "Cumpleaños, bautizos y aniversarios. Diseño a tu medida, de 10 a 40 porciones.",
        price: "Desde $180.000",
        details: ["Degustación de 3 sabores", "Diseño personalizado", "Entrega a domicilio"],
      },
      {
        name: "Bodas y eventos",
        description: "Pastel principal y mesa de postres para tu día, coordinados con tu planner.",
        price: "Desde $1.200.000",
        details: ["Reunión y degustación privada", "Pastel de 2 a 5 pisos", "Montaje en el lugar del evento"],
        featured: true,
      },
      {
        name: "Talleres de repostería",
        description: "Grupos pequeños de 6 personas para aprender macarons, laminados o chocolate.",
        price: "$220.000 por persona",
        details: ["4 horas prácticas", "Ingredientes incluidos", "Te llevas lo que horneas"],
      },
    ],
  },

  // ── 9. Testimonios ──────────────────────────────────────────
  // Demo: testimonios ficticios. En tu portfolio usa solo testimonios reales.
  testimonials: {
    items: [
      {
        quote: "El pastel fue lo primero que se acabó. Los invitados todavía nos preguntan por el relleno de maracuyá.",
        name: "Daniela y Tomás",
        context: "Boda, 180 invitados",
      },
      {
        quote: "Desde que tenemos sus croissants, los fines de semana se nos agotan antes del mediodía.",
        name: "Café La Ceiba",
        context: "Cafetería de especialidad",
      },
      {
        quote: "Explica cada paso con una paciencia enorme. Salí del taller haciendo macarons por primera vez.",
        name: "Mariana R.",
        context: "Taller de macarons",
      },
    ],
  },

  // ── 10. Habilidades ──────────────────────────────────────────
  skills: {
    title: "Técnicas y *sabores*",
    intro: "Lo que domino en el obrador y lo que sigo perfeccionando.",
    groups: [
      { name: "Técnicas", items: ["Laminado", "Merengue suizo", "Templado de chocolate", "Fondant y buttercream"] },
      { name: "Sabores firma", items: ["Maracuyá", "Lulo", "Cacao 70 %", "Pistacho", "Frutos rojos"] },
      { name: "Especialidades", items: ["Pasteles de boda", "Macarons", "Viennoiserie", "Sin gluten"] },
      { name: "Oficio", items: ["Costeo de recetas", "Fotografía de producto", "Atención de encargos"] },
    ],
  },

  // ── 11. Proyectos destacados (la sección más importante) ─────
  // Para agregar uno: copia un bloque { … }, pégalo y cambia el contenido.
  // Solo `title` y `summary` son obligatorios.
  projects: {
    title: "Creaciones *destacadas*",
    intro: "Tres encargos que cuentan cómo trabajo: una boda, una colección y una alianza con una cafetería.",
    items: [
      {
        title: "Pastel de bodas con frutos rojos",
        summary: "Cuatro pisos de bizcocho de vainilla y maracuyá para una boda de 180 invitados en un jardín.",
        type: "Boda",
        year: "2026",
        role: "Diseño, degustación, horneado y montaje",
        tools: ["Buttercream suizo", "Frutos rojos", "Flores comestibles"],
        cover: { src: "/fotos/pastel-bodas.jpg", alt: "Pastel de bodas blanco de cuatro pisos con fresas, moras y flores" },
        problem:
          "La pareja quería un pastel fresco y poco dulce que aguantara seis horas al aire libre, en pleno verano.",
        process: [
          "Hicimos una degustación con cinco combinaciones y elegimos vainilla con maracuyá.",
          "Cambié el fondant por buttercream suizo estabilizado para que resistiera el calor sin perder textura.",
          "Monté el pastel en el lugar, con frutos rojos frescos colocados a último momento.",
        ],
        result: "El pastel se mantuvo perfecto toda la noche y la pareja volvió para encargar su primer aniversario.",
        outcomes: [
          { value: "180", label: "invitados" },
          { value: "6 h", label: "al aire libre, sin perder la forma" },
        ],
        gallery: [{ src: "/fotos/pastel-bodas-2.jpg", alt: "Otro pastel de bodas blanco con rosas en un salón" }],
        slug: "pastel-bodas",
      },
      {
        title: "Colección de macarons de temporada",
        summary: "Doce sabores con frutas colombianas para la mesa de postres de un hotel boutique.",
        type: "Colección",
        year: "2025",
        role: "Desarrollo de sabores y producción",
        tools: ["Merengue italiano", "Pulpa de fruta", "Colorantes naturales"],
        cover: { src: "/fotos/macarons.jpg", alt: "Macarons de colores pastel alineados en una bandeja" },
        problem: "El hotel buscaba un postre que representara la región sin caer en lo típico.",
        process:
          "Probé más de 40 lotes hasta lograr un macaron estable con humedad alta y rellenos de fruta sin conservantes.",
        result: "La colección quedó en la carta del hotel durante toda la temporada alta.",
        outcomes: [
          { value: "12", label: "sabores nuevos" },
          { value: "2.400", label: "macarons por mes" },
        ],
        gallery: [{ src: "/fotos/macarons-torre.jpg", alt: "Pirámide de macarons de colores sobre un fondo gris" }],
        slug: "macarons",
      },
      {
        title: "Laminados para una cafetería",
        summary: "Croissants y pains au chocolat entregados cada mañana a una cafetería de especialidad.",
        type: "Alianza",
        year: "2025",
        role: "Receta, producción diaria y logística",
        tools: ["Mantequilla de 82 %", "Masa madre", "Fermentación en frío"],
        cover: { src: "/fotos/croissants-bandeja.jpg", alt: "Bandeja con croissants dorados recién horneados" },
        problem: "La cafetería necesitaba laminados frescos a las 7 a. m. sin tener un horno propio.",
        process: [
          "Ajusté la receta a una fermentación en frío de 36 horas para hornear al amanecer.",
          "Organicé una ruta de entrega que llega en menos de 20 minutos desde el horno.",
        ],
        result: "Hoy entrego cada mañana y la alianza se amplió a una segunda sede.",
        gallery: [{ src: "/fotos/croissants.jpg", alt: "Plato con croissants brillantes sobre una mesa blanca" }],
        slug: "laminados",
      },
    ],
  },

  // ── 12. En proceso ───────────────────────────────────────────
  // Ideal si estás empezando: lo que buscas, cursos, recetas en prueba, retos.
  lab: {
    title: "En *proceso*",
    intro: "Lo que estoy aprendiendo, probando y buscando. Trabajo en proceso, contado con honestidad.",
    // Qué oportunidades buscas hoy. Se muestra destacado con un botón de contacto.
    lookingFor: "Cafeterías de especialidad para ofrecer laminados frescos cada mañana.",
    updated: "Septiembre 2026",
    items: [
      {
        title: "Macarons con frutas colombianas",
        description: "Una colección con lulo, maracuyá y guayaba. Buscando el equilibrio entre acidez y dulzor.",
        kind: "Nueva colección",
        status: "En curso",
        year: "2026",
      },
      {
        title: "Chocolatería de origen",
        description: "Aprendiendo a trabajar cacao del Pacífico colombiano, desde el grano hasta la tableta.",
        kind: "Aprendiendo",
        status: "En curso",
        year: "2026",
      },
      {
        title: "Masa madre de cacao",
        description: "Un pan dulce con masa madre y cacao de origen. Voy por la versión número 9.",
        kind: "Receta en prueba",
        status: "En curso",
        year: "2026",
      },
      {
        title: "Macarons con menos azúcar",
        description: "Reduje el azúcar un 30 % sin perder la costra ni el pie del macaron.",
        kind: "Experimento",
        status: "Terminado",
        year: "2025",
      },
      {
        title: "12 laminados en 12 semanas",
        description: "Un laminado nuevo cada semana, documentado con fotos y errores incluidos.",
        kind: "Reto personal",
        status: "Terminado",
        year: "2025",
      },
    ],
  },

  // ── 13. Experiencia (opcional) ───────────────────────────────
  // Si todavía no tienes experiencia laboral, deja items: [] y la sección desaparece.
  experience: {
    items: [
      {
        role: "Fundadora y pastelera",
        company: "Obrador Camila",
        period: "2024 — Hoy",
        location: "Medellín",
        description: "Pastelería por encargo para bodas, eventos y cafeterías.",
        achievements: [
          "Más de 60 bodas atendidas en dos años.",
          "Alianzas con dos cafeterías de especialidad.",
        ],
      },
      {
        role: "Pastelera de producción",
        company: "Hotel Casa Almendro",
        period: "2020 — 2024",
        location: "Medellín",
        description: "Producción diaria de postres, panadería y banquetes de hasta 400 personas.",
      },
    ],
  },

  // ── 14. Formación (opcional) ─────────────────────────────────
  education: {
    items: [
      { program: "Técnica en Pastelería y Panadería", institution: "Escuela Gastronómica del Valle", period: "2018 — 2020" },
      { program: "Diplomado en Chocolatería", institution: "Taller de Cacao de Origen", period: "2023" },
    ],
    certifications: [
      { name: "Manipulación de alimentos", issuer: "Certificación sanitaria", year: "2024" },
      { name: "Decoración con buttercream", issuer: "Curso en línea", year: "2022" },
    ],
  },

  // ── 15. Contacto ─────────────────────────────────────────────
  contact: {
    title: "¿Tienes una fecha *especial*?",
    text: "Cuéntame qué celebras, cuántas personas serán y la fecha. Te respondo en menos de dos días con ideas y un presupuesto.",
    photo: { src: "/fotos/cupcake-rosa.jpg", alt: "Cupcake con crema rosa y una cereza" },
    // El botón usa tu WhatsApp o tu email automáticamente. Para cambiarlo:
    // cta: { label: "Agenda una llamada", url: "https://cal.com/tu-usuario" },
  },

  // ── 16. Estilo y colores ─────────────────────────────────────
  // Elige tu look con dos palabras:
  //   style:   "divertido" · "elegante" · "minimal"
  //   palette: "fresa" · "salvia" · "arena" · "lavanda" · "tinta"
  // Cada paleta trae su versión clara y oscura.
  theme: {
    style: "divertido",
    palette: "fresa",
    defaultMode: "light", // "light" · "dark" · "system" (según el dispositivo)

    // ¿Quieres ajustar un color? Escribe solo ese y se aplica encima de la paleta.
    // Colores en hexadecimal (#RRGGBB). `blocks` son los 4 colores de tarjetas y stickers.
    // light: { accent: "#D6336C" },
    // dark: { accent: "#FF9EC0" },
  },

  // ── 17. Textos de la interfaz (opcional) ─────────────────────
  // Cambia las palabras del menú y los títulos para adaptarlos a tu oficio.
  labels: {
    navProjects: "Creaciones",
    navServices: "Encargos",
    navSkills: "Técnicas",
    titleServices: "Encargos y *servicios*",
    titleGallery: "Recién *horneado*",
    problem: "El encargo",
    process: "Cómo lo hice",
    result: "El resultado",
    role: "Mi parte",
    tools: "Ingredientes y técnicas",
    viewProject: "Ver la historia",
    askService: "Pedir presupuesto",
    writeMe: "Escribirme",
  },
});
