import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import config from "../portfolio.config";
import { App } from "./App";
import { ContentProvider, createContent } from "./lib/content";

export function render(): string {
  return renderToString(
    <StrictMode>
      <ContentProvider content={createContent(config)}>
        <App />
      </ContentProvider>
    </StrictMode>,
  );
}
