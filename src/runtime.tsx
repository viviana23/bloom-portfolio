// Portfolio creado con el Editor de Bloom: el contenido viaja dentro de la página
// (<script id="bloom-config">), así no hace falta reconstruir nada para publicarlo.
import { setSrcsetEnabled } from "./lib/images";
import type { PortfolioConfig } from "./lib/types";
import { mount } from "./mount";

const el = document.getElementById("bloom-config");
if (el?.textContent) {
  setSrcsetEnabled(el.dataset.srcset === "true");
  mount(JSON.parse(el.textContent) as PortfolioConfig);
}
