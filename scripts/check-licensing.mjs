#!/usr/bin/env node
// Portable, source-only licensing guard. No GitHub Actions or external packages.
// Checks known mixed-rights boundaries, not full REUSE compliance/provenance.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const project = process.cwd();
const requireFile = (p) => {
  const full = join(project, p);
  if (!existsSync(full)) throw new Error("Missing licensing file: " + p);
  return readFileSync(full, "utf8");
};
const manifest = requireFile("REUSE.toml");
const scope = (id) => {
  const parts = manifest.split(/(?=^\[\[annotations\]\])/m);
  const entry = parts.find((part) =>
    part.includes('SPDX-License-Identifier = "' + id + '"'));
  if (!entry) throw new Error("No scope declared for " + id);
  const group = entry.match(/path\s*=\s*\[([\s\S]*?)\]/);
  if (!group) throw new Error("No file paths for " + id);
  return [...group[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
};
const allFiles = (dir) => {
  if (!existsSync(join(project, dir))) return [];
  return readdirSync(join(project, dir), { withFileTypes: true }).flatMap((entry) => {
    const p = join(dir, entry.name);
    return entry.isDirectory() ? allFiles(p) : entry.isFile() ? [p.replaceAll("\\", "/")] : [];
  });
};

const mit = requireFile("LICENSE");
if (!mit.startsWith("MIT License\n") || !mit.includes("Permission is hereby granted")) {
  throw new Error("Root LICENSE must contain unmodified MIT license");
}
if (mit !== requireFile("LICENSES/MIT.txt")) throw new Error("MIT texts diverged");
requireFile("LICENSES/CC-BY-4.0.txt");
requireFile("LICENSES/LicenseRef-Aha-Film.txt");
requireFile("LICENSING.md");
requireFile("BRAND.md");
requireFile("THIRD_PARTY_NOTICES.md");
const pkg = JSON.parse(requireFile("package.json"));
if (pkg.license !== "SEE LICENSE IN LICENSING.md") {
  throw new Error("npm license must point to LICENSING.md, not blanket MIT");
}

const reserved = new Set(scope("LicenseRef-Aha-Film"));
const cc = new Set(manifest.includes('SPDX-License-Identifier = "CC-BY-4.0"') ? scope("CC-BY-4.0") : []);
const source = scope("MIT");
if (!source.includes("src/**")) throw new Error("MIT engine scope is missing");
if (!reserved.has("src/styles.css") || !reserved.has("src/player/layout.css")) {
  throw new Error("Film CSS must not fall under blanket MIT");
}
for (const p of reserved) {
  if (!existsSync(join(project, p))) throw new Error("Reserved path does not exist: " + p);
}
for (const p of cc) {
  if (!existsSync(join(project, p))) throw new Error("CC BY document does not exist: " + p);
}
for (const dir of ["src", "public", "assets"]) {
  for (const p of allFiles(dir)) {
    if (/\.(?:css|svg|png|jpe?g|webp|gif|woff2?|ttf|otf)$/i.test(p) &&
        !reserved.has(p)) {
      throw new Error("New visual/font asset needs explicit rights review: " + p);
    }
  }
}
console.log("Licensing scope OK (source only): " + reserved.size +
  " reserved files, " + cc.size + " CC BY docs; MIT engine visible. " +
  "NOT a legal, history or complete REUSE lint audit.");
