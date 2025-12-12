import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error boundary for initialization
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h1>Application Error</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <pre>${error instanceof Error ? error.stack : ''}</pre>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}
