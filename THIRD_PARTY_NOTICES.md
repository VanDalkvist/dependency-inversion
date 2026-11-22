# Third-party notices and rights boundaries

The repository references third-party tools and fonts. Their rights **do not become MIT or reserved artwork** just because this application uses them. The following is a source-level inventory, not a build artefact audit of every transitive dependency.

| Used source | Expected upstream license / rights | Verification target |
| --- | --- | --- |
| React, React DOM | MIT | https://github.com/facebook/react/blob/main/LICENSE |
| Motion for React (`motion`) | MIT | https://github.com/motiondivision/motion/blob/main/LICENSE |
| Lucide icons (`lucide-react`) | ISC | https://github.com/lucide-icons/lucide/blob/main/LICENSE |
| `@vanya/ui` local sibling dependency | Mixed: original component code MIT; official Vanya Arc brand art under separate terms | https://github.com/VanDalkvist/vanya-ui/blob/main/LICENSING.md |
| Vanya Arc official brand | Original art has `LicenseRef-VanyaArc-Brand` where indicated; no blanket MIT for mark artwork | https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md |
| Google Fonts: Manrope, Fraunces, JetBrains Mono (via CSS `@import`) | SIL Open Font License 1.1 at upstream, subject to actual served files/version; font binaries are not vendored in this repo | https://fonts.google.com/ |
| Vitest, TypeScript, Vite, Tailwind and other build dependencies | Independent upstream licenses; inspect exact lockfile and final distributed bundle | `package-lock.json` and upstream package manifests |
| Architecture explanations and external research links | Citation-only; author names/work names remain those of the original rightsholders | Original URL for each quoted/referring passage |

For release, confirm installed package license data and any notices required by redistributed source or generated assets. This table is not a claim that the final bundle has been fully audited, or that third-party art may be sublicensed.
