import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/fraunces/soft-italic.css";
import "@fontsource-variable/geist";
import "./styles.css";
import { App } from "./App";
import { ContentProvider, createContent } from "./lib/content";
import type { PortfolioConfig } from "./lib/types";

/** Monta el portfolio. Si el HTML ya viene pre-renderizado, solo lo "hidrata". */
export function mount(config: PortfolioConfig) {
  const root = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <ContentProvider content={createContent(config)}>
        <App />
      </ContentProvider>
    </StrictMode>
  );
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
