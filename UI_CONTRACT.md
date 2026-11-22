# Aha! · Vanya Arc / UI integration contract

Source of truth is the **actual local sibling** `../vanya-ui`, not a copied design system or a web mockup.

Canonical source: `../vanya-ui/skills/vanya-ui/SKILL.md`. Pinned source SHA for deployment: `8a39e86fc276aa0b75726f308a00fdefd0b30934`.

```sh
node ../vanya-ui/scripts/ui-pipeline.mjs inspect --project .
node ../vanya-ui/scripts/ui-pipeline.mjs check --project .
node ../vanya-ui/scripts/ui-pipeline.mjs verify --project .
```

The story imports real `@vanya/ui` exports `ActionButton`, `ThemeToggle`, `WorkflowStrip`, `CraftCard`, `Tag`, and tokens. Read `../vanya-ui/src/index.ts`, exported component source, `DESIGN.md`, `docs/patterns/{interaction-states,action-feedback,typography,writing-and-editorial}.md` before a UI change.

`npm run test:ui` is a **jsdom/Vitest component-journey suite**, not a real browser or visual acceptance. The Vanya UI CLI's named browser-test gate discovers this executable UI test script; its exit code **does not prove screenshots, real keyboard navigation, visual contrast, font rendering, mobile geometry or human comprehension**. Those remain explicit independent browser/human gates at 1440/1024/390/320 CSS pixels, 200% zoom, dark/light and reduced motion.

Primary UX: a legible story with Anya, a consequence of each action, and actual source-owned service results. The full technical player is opt-in. Preserve both as one authoritative reducer. Do not enable GitHub Actions on push or PR; release via the configured manual Cloudflare Build.
