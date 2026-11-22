# Licensing — aha! / VANYA ARC

This is a **mixed-license repository**. The root [LICENSE](LICENSE) contains the unmodified MIT license **for the original software paths identified below, not a blanket license for all material**. See [REUSE.toml](REUSE.toml) for file-level SPDX identifiers. The package's `license` field says `SEE LICENSE IN LICENSING.md` rather than falsely declaring the whole application MIT.

Copyright © 2026 Vanya Afanasov, **to the extent ownership is held**. External works and contributors retain their own rights.

| Scope | License | What a visitor can reuse |
| --- | --- | --- |
| Original generic engine, functionality and tests: `src/player/**` **except the explicitly reserved film-specific files in `REUSE.toml`**; `src/content-factory/**`; non-excluded `src/stories/**` helpers/tests; application glue `src/App.tsx`, `src/main.tsx`, `src/lessons.ts` and config/test files | **MIT** — [LICENSE](LICENSE), [exact text](LICENSES/MIT.txt) | Study, copy, modify, redistribute and use commercially, keeping MIT copyright and permission notice |
| Film-specific visual presentation `src/styles.css`, `src/player/layout.css`, `src/player/guided.css`, `src/player/GuidedExperience.tsx`, `src/player/FocusedVisual.tsx`, `src/player/guided-copy.ts`; authored visual diagrams, narrative scripts and compositions in the **explicit `src/stories/**` files** selected in [REUSE.toml](REUSE.toml); the original proposed screenplays `docs/storyboards/AGENT_PUBLISHER_SCRIPT_V1.md` and `docs/storyboards/AGENT_PUBLISHER_SCRIPT_V2_DIP.md`; future original logos/illustrations | **LicenseRef-Aha-Film** — [limited-use terms](LICENSES/LicenseRef-Aha-Film.txt) | View, inspect and run the unmodified film locally for personal evaluation, education or review; **not** a license to clone the film artwork, publish branded derivatives or commercialize its original story expression |
| `docs/creative-loop/2026-11-22-ioc-feedback-cycle-01.md` and `docs/creative-loop/2026-11-22-arc-aha-brand-research.md`, **author-owned original passages only** | **CC BY 4.0** — [full text](LICENSES/CC-BY-4.0.txt) | Share and adapt, including commercially, with attribution, license link and indication of changes; external quotations are excluded |
| Other independently authored guides/repository documents | **MIT**, to the extent the material is owned | Reuse own writing under the MIT terms, but do not treat excerpts of third-party sources as relicensed |
| React, Motion, Lucide, Vanya UI, third-party fonts and any externally owned diagrams/text | **Their own upstream terms**, not this repository's blanket license | See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and actual upstream notices |

### Important distinction: open code, protected film

**MIT applies to the reusable software; it does not automatically license a finished branded film.** The expressive artwork here partly exists as CSS, TypeScript scene graphs and narrative text. Those selected files are reserved **as files** even where they contain some mixed code. This avoids an ambiguous statement that an entire file is both unrestricted MIT and proprietary artwork. For independent reuse of those specific algorithms, extract the reusable logic into an MIT module first.

Other TSX components under MIT may still reproduce structural UI or contain the string `aha!`: the copyright license for **code** is permissive, while protected logos/artwork and misleading brand use are governed separately. This cannot prohibit someone from independently implementing similar ideas, layouts, techniques or a generic sine wave. Trademark and originality claims require separate evidence; **no registered mark is asserted**.

Do not move branded artwork into new `src/` locations and expect it to stay protected automatically. Update this map and [REUSE.toml](REUSE.toml) each time a new story/media file is added.

### Third-party and author rights

- [Vanya Arc Brand](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md) owns its separate mark-artwork rights map; `@vanya/ui` may expose branded components without relicensing the mark under MIT.
- Linked references, original books, quoted articles, icon packages, and external images are not reissued as this project's property. A URL is not permission to copy a work.
- Software license texts do not grant exclusive rights to generic design concepts. `BRAND.md` describes permitted identity uses, subject to applicable law.
- We have not verified independent copyright ownership for **every** historical contribution or obtained a trademark clearance opinion. All scope claims are limited to rights actually owned.

### Practical note for maintainers

Check `REUSE.toml` and `LICENSES/` when adding assets, scenes or dependencies. Run `reuse lint` in a workspace with the REUSE CLI before declaring full compliance; presence of annotations alone does **not** mean this has passed. The historic commits contain personal author metadata and local paths; [public-release audit](docs/creative-loop/2026-11-22-licensing-and-history-audit.md) must be addressed before changing repository visibility.

Official references: [OSI MIT](https://opensource.org/license/mit), [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode), [CC FAQ on logos/software](https://creativecommons.org/faq/), [REUSE 3.3](https://reuse.software/spec-3.3/), [GitHub licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).
