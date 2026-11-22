# IOC Film — handoff for PR #1

> **Script pre-production update · 2026-11-23:** the owner likes the new story but wants **Anya chatting with a neural agent** and an unmistakable before/after change in the agent-facing publishing interface. [Story screenplay v1](../storyboards/AGENT_PUBLISHER_SCRIPT_V1.md) + [research, 12-way brainstorm, critic](2026-11-23-agent-story-storm-04.md) are **proposal-only**; **no live code, production UI or release updated** by this script round. The last actually deployed runtime and its test receipts below remain authoritative. Do not mark this as game-tools code-loop COMPLETE or claim browser/human RAT.

> **Current release · Cycle 03 · 2026-11-23:** [Storytelling research and proof](2026-11-23-storytelling-cycle-03.md). Published source `06ace1a5a3c91afe48bbfeb2531417acfc78b836`; Cloudflare Worker `ioc` version `4368966b-f000-4eaa-a5db-38b1ef0e4ba0` on both `aha.vanya-arc.dev` and `ioc.vanya-arc.dev`. 100/100 tests, TypeScript/Vite, licensing source guard and portable Vanya UI `inspect/check/verify` passed; independent browser/human comprehension gates remain NOT VERIFIED. Prior 2026-11-22 handoffs below are preserved as historical snapshots.

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

## Release verification — 2026-11-22 (supersedes earlier unreleased snapshot above)

**SUCCESSFULLY DEPLOYED** as Cloudflare Worker `ioc`, version `00f232b0-9e19-464c-82c4-fbf14d20159f` (confirmed in Wrangler production logs). Existing host `ioc.vanya-arc.dev` and newly attached `aha.vanya-arc.dev` both routed to it, and `/di/` is a separately bundled HTML page. This supersedes earlier “not deployed” handoff status; the original source-only caution was correct at the time.

- **Release source SHA:** `ed249dbf9d85c908d1a1d6a629bcc06cf5dc9add` (feature branch), **not merged to `main`**. Draft PR #1 remains open.
- **Cloudflare Workers Builds ID:** `884d8661-e312-4a3b-ad2d-37d19d74846f`. Manual-only trigger `538e21db-2e7b-4fb6-9dec-b91e872c492c`; source build runner at `scripts/cloudflare-release-build.mjs`; Cloudflare config generated at build time, excluded from Git.
- **Proof from actual remote build:** Vitest 20 test files / 92 tests passed; TypeScript build completed; Vite bundled both `dist/index.html` and `dist/di/index.html`; explicit `npm run check:licensing` passed with 19 reserved brand/film files and 2 CC BY research documents; Wrangler uploaded 7 changed static assets, including three selected-logo SVG files and both pages; Wrangler reported `Success! Deploy command completed` and `Success! Build completed.`
- **Build fixes obtained by running real tests:** targeted a previously ambiguous “Выбрать RSS” test within narration; replaced an obsolete “фабрики контента” test assertion with current plain-language intro; deduplicated @types/react and @types/react-dom between the source-linked Vanya UI sibling and the app in the build runner; replaced a wildcard `public/*.svg` entry with exact reserved SVG paths in `REUSE.toml`. No test skip or TypeScript-ignore was used.
- **Environment note:** the existing Vanya UI repository was checked out as an adjacent sibling by the remote release build and `bun install --frozen-lockfile` ran there, then `npm ci` in this repo; the two React type trees were explicitly unified in the build's temporary workspace.
- **Remaining limits:** the public site could not be retrieved by the generic web fetch tool; Cloudflare Browser Rendering content endpoint returned rate limit (HTTP 429), so a live first-person browser visual QA, mobile viewport audit and human comprehension RAT are **NOT VERIFIED**. Successful Wrangler API deployment proves asset publication, not frontend UX correctness. Any later visual issue must be addressed on a new verified cycle.
- **No CI automation:** Cloudflare trigger filters use a deliberately non-matching path and builds are launched manually. `main` and the old `ioc` domain remain intact as source respectively DNS alias, though the same worker serves updated assets.

## Rebuild cycle 02 · 2026-11-23 — supersedes the former dashboard UX

**Trigger:** the owner explicitly rejected the previously deployed “simplification” as functionally the same overloaded interface with a new logo and tiny fonts. This cycle removed the **initial experience model**, not merely some SVG nodes.

**New default on both domains:** `src/player/GuidedExperience.tsx` + `guided.css` + `guided-copy.ts` + `FocusedVisual.tsx`. One current story beat with a human-sized heading, 18–20px explanatory text, one large choice set and its real consequence; explicit continuation; no autoplay. Choices remain real scene action handlers, and the former interactive graph/inspector/transport exists behind “Исследовать схему и код”. Mode switching keeps prior answers and results. The final sandbox is optional. Mobile uses natural document scroll without forced split panes.

**Creative record:** [cycle 02 NMT, 12 ideas, adversarial critic, TRIZ/MDA, review, proof](2026-11-23-first-view-rebuild-cycle-02.md), plus [durable lessons](MEMORY.md). The separate creative-loop skill is a source for method, not another runtime service.

**Latest verified release:** source code `ddc7b940f4466067f8c64a0464d004c1d0ed712f`, Cloudflare build `0fd737cb-8e01-486d-9db7-76443fa76b61`, Worker `ioc` version **`0cb590bf-53c5-4df4-abd2-ec9be47ca576`**, custom domains **`aha.vanya-arc.dev` and `ioc.vanya-arc.dev`**. Pipeline: **100/100 Vitest PASS**, TypeScript PASS, Vite PASS (nonblocking >500k JS warning), licensing source-guard PASS (23 reserved, 2 CC docs), Wrangler upload and deployment PASS. Cloudflare is in a separate **manual-only** build trigger, not an auto-running GitHub Action.

**Limitations remain:** no browser screenshot at 320/390/1440 or at 200% zoom, no actual assistive tech/keyboard walkthrough, no 3–5 novice comprehension interview; browser context unavailable and Cloudflare Browser Rendering rate-limited. These remain **NOT RUN**; positive unit tests are not user acceptance. No PR merge or main mutation was made, and the branch has diverged since `main` received licensing. Draft [PR #1](https://github.com/VanDalkvist/dependency-inversion/pull/1) remains open; resolve that conflict deliberately before any merge.

**Concrete user test:** open `https://aha.vanya-arc.dev/di/` without explanation. In the first 10 seconds, ask “Что ты здесь можешь сделать?”; after switching the publication channel ask “Что изменилось и что осталось прежним?”. Record unprompted clicks and whether the ninth step is worth reaching. If two people fail to find the choice or can't explain the channel swap, the next cycle should consider a shorter 4–5-beat story and simpler conceptual model, **not** another logo or decorative Motion pass.

## Cycle 03 final handoff — 2026-11-23

### Current experience

- The first home heading is now **“Аня отправила выпуск в Telegram”** (positive concrete event), followed by a lunch-time request to publish the same issue on a website. The observer sees Anya's attempt, changed shared publication rule, and the two channels. The DI route starts **“Аня собирает помощника для новостей”** and makes a genuine source-backed publication choice and channel swap.
- Beginner-directed route: **6 DIP / 5 DI authored beats**, not nine technical quiz scenes. The underlying expert nine-scene lessons are available behind **“Посмотреть схему и код”**. The single `PlaybackState` remains authoritative, no duplicate business simulation.
- Visual props use actual Vanya UI `CraftCard`, `Tag`, `WorkflowStrip`, `ActionButton`, `ThemeToggle` from commit `8a39e86fc276aa0b75726f308a00fdefd0b30934`; Motion updates only relevant selected channel/artifact and respects reduced-motion. `UI_CONTRACT.md` documents portable integration. No local recreation of the UI component APIs.
- The Russian story copy was authored with sources from Sarycheva/Arkhipov `redaktura`, `ux-copy`, `statya` and independent narrative guides. The full 12-option creative brainstorm and source-backed critic are in [Cycle 03](2026-11-23-storytelling-cycle-03.md). Fictional character/situation disclosed on-screen.

### Build receipts and limits

- **Release source SHA** `06ace1a5a3c91afe48bbfeb2531417acfc78b836`, manual Cloudflare build `ef6ace74-a19c-4f72-99bd-b7ea66ce9823`. `npm test` **100/100** across 21 test files, `npm run build` TypeScript + Vite **PASS**, `npm run check:licensing` **PASS** (23 reserved scene/brand files, 2 CC BY docs).
- Portable Vanya UI `inspect`, `check`, `verify`: **PASS** with the pinned real sibling library, including `test:ui` **8/8** jsdom interactive story tests. **This is not a real-browser E2E or screenshot pass.** It proves source/test behavior, not visual acceptance.
- Wrangler production result: **`Success: Deploy command completed`**, Worker `ioc` version **`4368966b-f000-4eaa-a5db-38b1ef0e4ba0`**, both custom domains. A prior version `f362e3e8-3982-43ca-9e05-9b2d13046c0e` included the same app assets; final build added the canonical UI verification runner and deployed with no changed assets.
- Real browser screenshot/service: **BLOCKED**, Cloudflare Browser Rendering HTTP 429 / rate limit (asked not to retry ~4124 seconds). Browser-origin tabs connector unavailable in this chat. No visuals actually observed. No 320px, 390px, 1024px, 1440px screenshots or 200% zoom keyboard/screen-reader audit. Human first-time story RAT **NOT RUN**; the owner has NOT yet accepted this edit.
- **PR safety**: [Draft PR #1](https://github.com/VanDalkvist/dependency-inversion/pull/1) remains OPEN, DRAFT, no merge; base `main` has diverged. The latest added docs (this commit) do not change the deployed runtime code. Avoid force-merge and clear conflicts deliberatively.

### Next acceptance observation (not another UI feature request)

Ask a fresh non-programmer to open `https://aha.vanya-arc.dev/` and **say what happened to Anya** before they click; then ask what changes when the site receives the same text, and observe actual clicks/reactions. A working DOM test cannot answer this. If the viewer still feels they are choosing correct multiple-choice quiz answers rather than influencing the release, investigate the **choice grammar and story stakes** before adding animations or controls.
