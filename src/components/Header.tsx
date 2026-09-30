import { useEffect, useRef, useState } from "react";
import { NAV_VISIBLE_DESKTOP, config, initials, labels, navItems, sectionAnchor, sectionNumber, visibleSections } from "../lib/content";
import { useActiveSection, useScrolled } from "../lib/hooks";
import { ArrowRight, ChevronDown, Close } from "./Icons";
import { SocialLinks } from "./primitives";
import { ThemeToggle } from "./ThemeToggle";

// Observamos todas las secciones para que el menú solo resalte la que se ve.
const sectionIds = ["inicio", ...visibleSections.map((id) => sectionAnchor[id])];

function Monogram() {
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent font-serif text-[0.95rem] italic text-accent-fg"
    >
      {initials(config.person.name)}
    </span>
  );
}

type NavItem = (typeof navItems)[number];
const sectionNav = navItems.filter((n) => n.id !== "contact");
const primaryNav = sectionNav.slice(0, NAV_VISIBLE_DESKTOP);
const moreNav = sectionNav.slice(NAV_VISIBLE_DESKTOP);

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`inline-flex h-10 w-full items-center whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 ${
        active ? "bg-fg text-bg" : "hover:bg-block-1 hover:text-on-block-1"
      }`}
    >
      {item.label}
    </a>
  );
}

/** "Más ▾": las secciones que no caben en la barra de escritorio. */
function MoreMenu({ items, active }: { items: NavItem[]; active: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasActive = items.some((i) => i.href.slice(1) === active);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mas"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 ${
          hasActive ? "bg-fg text-bg" : "hover:bg-block-1 hover:text-on-block-1"
        }`}
      >
        {labels.navMore}
        <ChevronDown className={`text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id="menu-mas"
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 min-w-[13rem] rounded-[calc(1.25rem*var(--round))] border-[length:var(--bw)] border-[color:var(--line)] bg-bg p-2 shadow-[var(--pop)]"
      >
        {items.map((item) => (
          <li key={item.id}>
            <NavLink item={item} active={active === item.href.slice(1)} onClick={() => setOpen(false)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header() {
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeMenu = () => menuRef.current?.close();
  const contactHref = navItems.find((n) => n.id === "contact")?.href;

  return (
    <header className="sticky top-0 z-40 pt-3 md:pt-4">
      <div className="container-page">
        <div
          className={`flex h-14 items-center justify-between gap-4 rounded-full border-[length:var(--bw)] border-[color:var(--line)] bg-bg px-2 transition-shadow duration-300 md:h-[3.75rem] ${
            scrolled ? "shadow-[var(--pop)]" : ""
          }`}
        >
          <a href="#inicio" className="flex min-h-11 items-center gap-2.5 rounded-full pr-3 transition-opacity hover:opacity-80">
            <Monogram />
            <span className="text-title text-[1.15rem] leading-none">{config.person.name}</span>
          </a>

          <nav aria-label={labels.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <NavLink item={item} active={active === item.href.slice(1)} />
                </li>
              ))}
              {moreNav.length > 0 && (
                <li>
                  <MoreMenu items={moreNav} active={active} />
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {contactHref && (
              <a
                href={contactHref}
                className="hidden h-10 items-center gap-2 rounded-full bg-accent px-5 text-[0.9375rem] font-semibold text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 lg:inline-flex"
              >
                {labels.navContact}
                <ArrowRight />
              </a>
            )}
            <button
              type="button"
              onClick={() => menuRef.current?.showModal()}
              aria-haspopup="dialog"
              aria-label={labels.menu}
              title={labels.menu}
              className="grid h-11 w-11 place-items-center rounded-full bg-fg text-bg lg:hidden"
            >
              <span aria-hidden="true" className="flex w-[18px] flex-col gap-[5px]">
                <span className="h-[2px] w-full rounded bg-current" />
                <span className="h-[2px] w-full rounded bg-current" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil: diálogo nativo (foco atrapado y Escape incluidos) */}
      <dialog
        ref={menuRef}
        aria-label={labels.mainNav}
        className="project-dialog lg:hidden"
        style={{ background: "var(--block-1)", color: "var(--on-block-1)" }}
        onClick={(e) => e.target === e.currentTarget && closeMenu()}
      >
        <div className="flex min-h-full flex-col">
          <div className="container-page flex h-[4.5rem] items-center justify-between pt-3">
            <span className="flex items-center gap-2.5">
              <Monogram />
              <span className="text-title text-[1.15rem] leading-none">{config.person.name}</span>
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label={labels.closeMenu}
              title={labels.closeMenu}
              className="grid h-11 w-11 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line-current)]"
            >
              <Close className="text-xl" />
            </button>
          </div>

          <nav aria-label={labels.mainNav} className="container-page flex-1 pt-8">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-[calc(1.25rem*var(--round))] px-4 py-2.5 text-title text-[1.875rem] leading-tight transition-colors hover:bg-bg"
                  >
                    {item.label}
                    <span className="text-[0.8125rem] font-semibold tracking-widest opacity-70">
                      {sectionNumber(item.id)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-page flex flex-col items-start gap-6 pb-10 pt-8">
            <SocialLinks links={config.links} />
            <ThemeToggle className="bg-bg text-fg" />
          </div>
        </div>
      </dialog>
    </header>
  );
}
