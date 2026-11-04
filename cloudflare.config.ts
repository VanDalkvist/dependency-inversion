import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "2b49ab259f7d0f7ee2e10fb38267744b",
  worker: {
    name: "ioc",
    compatibilityDate: "2026-11-04",
    workersDev: false,
    domains: ["ioc.vanya-arc.dev"],
    assets: { notFoundHandling: "single-page-application" },
  },
});
