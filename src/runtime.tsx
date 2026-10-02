// Portfolio creado con el Editor de Bloom: el contenido viaja dentro de la página
// (<script id="bloom-config">), así no hace falta reconstruir nada para publicarlo.
import type { PortfolioConfig } from "./lib/types";
import { mount } from "./mount";

const data = document.getElementById("bloom-config")?.textContent;
if (data) mount(JSON.parse(data) as PortfolioConfig);
