import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design/theme.css";
import "./design/design.css";
import "./app/app.css";
import { App } from "./App";
import { initTheme } from "./design/theme";

initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
