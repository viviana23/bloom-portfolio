import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/fraunces/soft-italic.css";
import "@fontsource-variable/geist";
import "./styles.css";
import { App } from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// En producción el HTML viene pre-renderizado: solo lo "hidratamos".
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
