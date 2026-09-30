import { labels } from "../lib/content";
import { useTheme } from "../lib/hooks";
import { Moon, Sun } from "./Icons";

/**
 * Un solo botón: alterna entre claro y oscuro.
 * Mientras nadie lo toque, el sitio sigue el tema del dispositivo (o `theme.defaultMode`).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolved, setMode } = useTheme();
  const isDark = resolved === "dark";
  const label = isDark ? labels.themeLight : labels.themeDark;
  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-full border-[length:var(--bw)] border-[color:var(--line-current)] transition-colors duration-200 hover:bg-block-1 hover:text-on-block-1 ${className}`}
    >
      {/* Antes de hidratar no sabemos el tema: se muestra la luna sin parpadeo de layout */}
      {isDark ? <Sun className="text-[1.15rem]" /> : <Moon className="text-[1.15rem]" />}
    </button>
  );
}
