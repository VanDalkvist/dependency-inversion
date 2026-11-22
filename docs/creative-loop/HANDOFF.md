# IOC Film — handoff for PR #1

**Date:** 2026-11-22 · **branch:** `feat/ioc-creative-loop-ux-20261122` → `main` · **PR:** https://github.com/VanDalkvist/dependency-inversion/pull/1 (DRAFT) · **deploy:** NOT DONE.

## What shipped to the PR

- Familiar promise before architecture terminology on DI / DIP
- Plain-language DI narrative and three recognizable chapters
- Single visible instruction and optional schema explainer
- Cold start with one centered helper; choices emerge one phase at a time (source → writer → channel) after the viewer acts
- Automatic playback continuation after successful choice, explicit “Дальше сейчас” without separate Play
- Mobile narration not concealed after a choice; optional graph reveal and extended explanation pause the timer so readers can inspect
- Pause/resume around inspector, purposeful Motion response, reduced-motion awareness
- Regression test cases written for reducer, phase-scoped stage, mobile first choice and reader-controlled pauses; **not yet run**

See [complete creative cycle](2026-11-22-ioc-feedback-cycle-01.md) for NMT, 12 alternatives, critic decisions, research, source-only static review and falsifiable RAT.

## Status / what is NOT established

**COMMITTED + SOURCE REVIEWED; BUILD NOT RUN, BROWSER NOT RUN, HUMAN UX TEST NOT RUN, RELEASE NOT APPROVED.** Existing `@vanya/ui` is a local sibling dependency; this GitHub-connected session did not have a runnable local checkout, browser screenshot tooling or deployment access. Do not merge/deploy based only on this source pass.

## Portable validation before merge

From local IOC checkout with `../vanya-ui` present:

```sh
npm test
npm run build
node ../vanya-ui/scripts/ui-pipeline.mjs inspect --project .
node ../vanya-ui/scripts/ui-pipeline.mjs check --project .
node ../vanya-ui/scripts/ui-pipeline.mjs verify --project .
```

Open locally as a first-time viewer at `/di/` and `/`. At 1440×900, 1024×768, 390×844, 320×568, verify first focal point, viewport stability, independent scrolling, keyboard, large-text/zoom and reduced motion. Choose wrong/right, open/close inspector, pause, switch graph/text, advance and replay. Verify actual documents differ when changing publisher. Record screenshots and outcomes in this same repo, not just “looks fine”.

**Highest-risk test:** first verify the one-card cold start and only the active service pair per phase, then ask 3–5 people without software background to describe in their own words what stays the same when changing the channel, and where they would use the idea. If they cannot, revise story/diagram from zero; do not add more animations as a substitute.

**Do not** merge PR #1 or assume Cloudflare deployed this branch. The next iteration should be a *new full Creative Loop* informed by observed first-use data, not an administrative continuation of this cycle.

## Identity and domain update · 2026-11-22

- **Owner-selected mark:** Variant #4 «С импульсом» from the user-supplied logo board. The mark uses the canonical Vanya Arc wave geometry with three small accent rays; no extra arc or dot. Wordmark is **Vanya Arc / Aha!**, with compact narrow-screen reduction.
- Committed to existing feature branch: `public/aha-impulse-mark.svg`, `public/aha-impulse-mark-dark.svg`, `public/favicon.svg`, header, brand styles, metadata and tests; explicitly protected in `REUSE.toml`.
- Domain `aha.vanya-arc.dev` **attached through Cloudflare API** to existing `ioc` Worker; `ioc.vanya-arc.dev` remains active, and private deployment repo has both custom-domain routes. This action does not publish new source: old assets remain until a real build + deploy.
- Local release path remains: checked-out `dependency-inversion` feature branch and sibling `vanya-ui`, run `npm test && npm run build && npm run check:licensing`, then `bun run deploy:ioc` from sibling `cloudflare-deploy`. The CLI on this connected chat session has no runnable checkout with installed packages or compiled `dist`; **do not claim live brand release**.
- Before release, independently verify `/favicon.svg`, `/` and `/di/` at `aha.vanya-arc.dev`, the 320px header, dark theme logo, mobile chapter navigation, reduced motion and interactive playback. Record evidence.
