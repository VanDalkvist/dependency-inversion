#!/usr/bin/env node
// Portable, manual CI build for the existing IOC Worker. Builds and tests, but
// never deploys. Deployment requires a separate explicit Wrangler command.
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ui = resolve(root, "../vanya-ui");
// Pin Vanya UI to the exact public source reviewed for this design cycle.
const VAN_YA_UI_SHA = "8a39e86fc276aa0b75726f308a00fdefd0b30934";
function run(bin, args, cwd = root) {
  console.log("[aha build]", bin, ...args);
  execFileSync(bin, args, { cwd, stdio: "inherit" });
}
if (!existsSync(join(ui, "package.json"))) {
  run("git", ["clone", "--quiet", "--depth", "1",
    "https://github.com/VanDalkvist/vanya-ui.git", ui]);
}
run("git", ["fetch", "--quiet", "--depth", "1", "origin", VAN_YA_UI_SHA], ui);
run("git", ["checkout", "--quiet", "--detach", VAN_YA_UI_SHA], ui);
const config = {
  name: "ioc",
  compatibility_date: "2026-11-04",
  workers_dev: false,
  preview_urls: false,
  assets: {
    directory: "./dist",
    html_handling: "auto-trailing-slash",
    not_found_handling: "404-page",
  },
  routes: [
    { pattern: "ioc.vanya-arc.dev", custom_domain: true },
    { pattern: "aha.vanya-arc.dev", custom_domain: true },
  ],
};
writeFileSync(join(root, "wrangler.aha.jsonc"), JSON.stringify(config, null, 2) + "\n");
run("bun", ["install", "--frozen-lockfile"], ui);
run("npm", ["ci"]);
// Vanya UI is a source-linked sibling package. Both projects install React
// types independently, and TS sees incompatible Ref symbols in SVG props.
// Use one canonical @types/react tree across both source workspaces.
for (const packageName of ["react", "react-dom"]) {
  const source = join(root, "node_modules", "@types", packageName);
  const target = join(ui, "node_modules", "@types", packageName);
  if (!existsSync(source)) throw new Error("Missing canonical types: " + source);
  rmSync(target, { recursive: true, force: true });
  symlinkSync(source, target, "dir");
  console.log("[aha build] shared @types/" + packageName + " with Vanya UI");
}
run("node", ["../vanya-ui/scripts/ui-pipeline.mjs", "inspect", "--project", root]);
run("node", ["../vanya-ui/scripts/ui-pipeline.mjs", "check", "--project", root]);
// When source-importing Vanya UI from an adjacent repository, its own
// node_modules/react is a second hook dispatcher in Vitest (Invalid hook call).
// Keep ONE physical React runtime in this disposable CI workspace.
// This does not modify the upstream library repository or its lockfile.
for (const packageName of ["react", "react-dom"]) {
  const source = join(root, "node_modules", packageName);
  const target = join(ui, "node_modules", packageName);
  if (!existsSync(source)) throw new Error("Missing React runtime: " + source);
  rmSync(target, { recursive: true, force: true });
  symlinkSync(source, target, "dir");
  console.log("[aha build] shared React runtime " + packageName + " with Vanya UI");
}
run("npm", ["test"]);
run("npm", ["run", "build"]);
run("npm", ["run", "check:licensing"]);
console.log("[aha build] Tests/build/rights guard passed. Ready for explicit Wrangler deploy.");
