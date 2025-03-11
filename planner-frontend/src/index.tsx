import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./i18n.ts"; // Initializes i18next
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
