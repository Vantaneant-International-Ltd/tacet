import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

// The React SPA lives in client/ and builds to dist/client, which the Worker serves
// as static assets (see wrangler.jsonc). The dev API is proxied to `wrangler dev`
// when running `vite` directly, but the documented dev path is `npm run dev`
// (build once, then serve everything from the Worker).
export default defineConfig({
  root: "client",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
