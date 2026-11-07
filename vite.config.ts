import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom"] },
  build: {
    rolldownOptions: { input: { dip: "index.html", di: "di/index.html" } },
  },
  server: {
    host: "0.0.0.0",
    port: 4178,
    strictPort: true,
    allowedHosts: ["vanya--4178.getbb.app", "vanya--4178.next.getbb.app"],
  },
  test: {
    environment: "jsdom",
    testTimeout: 30000,
    setupFiles: ["src/test/setup.ts"],
  },
});
