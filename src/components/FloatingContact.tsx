import { useEffect, useState } from "react";
import { config, contactLink, labels, sectionAnchor } from "../lib/content";
import { Mail, WhatsApp } from "./Icons";

/**
 * Botón flotante de contacto. Usa tu WhatsApp (o tu email si no tienes).
 * Aparece después del hero y se esconde al llegar a la sección de contacto.
 */
export function FloatingContact() {
  const link = contactLink();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      const contact = document.getElementById(sectionAnchor.contact);
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setVisible(pastHero && !atContact);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!link || config.site.floatingButton === false) return null;
  const isWhatsApp = link.url.startsWith("https://wa.me/");

  return (
    <a
      href={link.url}
      {...(isWhatsApp && { target: "_blank", rel: "noopener noreferrer" })}
      aria-label={isWhatsApp ? `${labels.writeWhatsApp} ${labels.opensInNewTab}` : labels.writeMe}
      title={isWhatsApp ? labels.writeWhatsApp : labels.writeMe}
      inert={!visible}
      className={`floating-contact fixed z-30 grid h-14 w-14 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-accent text-accent-fg shadow-[var(--pop)] transition-[transform,opacity,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:shadow-[var(--pop-lg)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {isWhatsApp ? <WhatsApp className="text-[1.6rem]" /> : <Mail className="text-[1.5rem]" />}
    </a>
  );
}
