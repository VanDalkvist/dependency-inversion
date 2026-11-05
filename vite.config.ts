import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "test" ? [] : [cloudflare()])],
  resolve: { dedupe: ["react", "react-dom"] },
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
}));
