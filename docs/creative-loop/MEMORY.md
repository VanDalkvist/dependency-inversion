# Aha! · creative-loop memory (reader-facing evidence)

## 2026-11-23 · Cycle 02 — owner-observed failure is not a test flake

**Observed by owner (2026-11-22):** The previous “progressive” UI still felt like the old technical dashboard with a new logo and unreadably small type. Despite 92 passing automated tests, real comprehension was not established. This evidence supersedes the previous agent's optimistic source-only first-use claims.

**Reusable decision for this project:** The primary learning interface cannot start as a diagram editor or media-control dashboard. Begin with a human situation, one readable current decision and the *actual consequence* of that decision. Keep technical depth on explicit request, not visually adjacent to the beginner's task.

**Applied in source:** `GuidedExperience` is the default mode; its own CSS controls type size and responsive hierarchy. `FocusedVisual` reads the original reducer's selections and actual result objects; technical StoryPlayer/Stage remains reachable by the footer action. A manual release build runs the full existing 100-test suite, TypeScript, Vite and licensing guard.

**Important limitation:** No new novice user sessions, 320px browser screenshots, contrast measurements or screen-reader sessions have been observed. The user's next feedback and 3–5 independent first-use sessions must determine whether the direction is actually better. The older 9-scene structure remains a potential source of fatigue.

**Next creative cycle must start by re-reading this file, the current live code and prior Cycle 02 research.** Do not declare the user job solved because tests are green. A repeated complaint about overload should trigger a story-length/content model critique, not another icon or animation experiment.

## 2026-11-23 · Cycle 03 — a question isn't a dramatic opening

**OWNER-OBSERVED (2026-11-22):** the released default home story began `Как не привязать помощника к одному сервису?`, and the owner found it unintelligible and unrelated to storytelling. A sentence beginning with negation in the first contact was the immediate failure; the deeper failure was an abstract programming issue where a concrete event should be.

**Current repair, SOURCE+BUILD OBSERVED:** first DIP scene is `Аня отправила выпуск в Telegram`; the next beat introduces a website demand. Source now contains complete heroine/event/obstacle/action/consequence copy for both routes; the novice route selects 6 DIP / 5 DI beats, leaves the nine-scene expert view opt-in and uses actual pinned Vanya UI components (`ActionButton`, `CraftCard`, `WorkflowStrip`, `Tag`, `ThemeToggle`) with Motion for causal transitions. Portable Vanya UI inspect/check/verify and 100/100 tests passed in Cloudflare remote environment, deployed Worker version `4368966b-f000-4eaa-a5db-38b1ef0e4ba0`. This is NOT user comprehension evidence.

**Next-cycle operational rule:** Before UI implementation, read only the authored *scene headings*: do they describe actions taken by a person in a situation, including an interruption, and is there a consequence? If they are concept labels or generic questions, rebuild the story arc first. Then use the original Sarycheva/Arkhipov editorial source with seven passes (meaning before polish) and the **actual** `@vanya/ui` source; add a copy-level negative-first test and a full state-journey test. This is bounded to narrative onboarding, not a universal prohibition on negative factual statements or technical reference docs.

**Not verified:** actual visual composition at 320/390/1440 CSS px, reduced motion in an actual browser, 200% zoom, uncoached human comprehension, artistic acceptance. Cloudflare screenshot service returned HTTP 429; continue to treat this as a real blocker, not evidence of success. Next cycle should start from owner observations, not celebrate green tests.

## 2026-11-23 · Cycle 04 pre-production — changing destination is not explaining a dependency

**Owner-observed:** Storytelling substantially improved; the agent still needs to be presented as a neural assistant Anya chats with, and a novice cannot tell which software architecture part changed from a visual swap of Telegram/site. This supersedes the previous hypothesis that a fixed bulletin with two publishing cards is a sufficient DIP explanation. **Source-observed:** the default visual renders destinations but lacks the agent-facing tool contract; `src/stories/dip/scenes.ts` does contain the correct source-level `Publisher` boundary.

**Revised script-design heuristic:** repeat one user message **verbatim** before and after a one-time architectural refactor, hold the draft/news process constant, and visually expose the single changed **contract boundary** (agent knows a concrete Telegram command → agent knows a publication operation implemented by channel-specific adapters). Show the tool failure and its cause *before* naming DIP; ensure the new website adapter requires actual implementation and that a model cannot gain tools by chat alone. This is a **design hypothesis**, not comprehension proof. Counterexample: when explaining a visual style difference, identical input may not expose the relevant mechanism; do not universalize the technique.

**Proposal-only artifact:** [AGENT_PUBLISHER_SCRIPT_V1.md](../storyboards/AGENT_PUBLISHER_SCRIPT_V1.md) plus [storm/research](2026-11-23-agent-story-storm-04.md). **Current runtime and deployed site unchanged**. Main PR remains Draft. Subsequent implementation loop must re-read these scripts, check true action IDs and browser state, and collect human contrast explanations before claiming acceptance.

## 2026-11-23 · Screenplay critique 05 — same destination changed / architecture still invisible

**Owner observation:** “по этому сценарию я вижу только, что ... сделали публикатор на сайт и опубликовали на сайт ... при чём тут инверсия зависимостей непонятно”. The previous comparison of Telegram-only vs Telegram+website teaches capability expansion (and can be achieved with a hard-coded `if`), **not** DIP. Therefore **SUPERSEDE** Cycle 04’s proof strategy “same user request + new destination demonstrates inversion.”

**Source re-check:** `src/stories/dip/scenes.ts` correctly assigns `Publisher.publish(Draft)` to the content scenario and makes Telegram and website implementations depend on that contract; `wrapper` specifically rejects retaining Telegram `chatId/parse_mode` inside a superficially generic wrapper. Martin Fowler DIP-in-the-wild and Robert Martin A Little Architecture confirm DIP concerns level/ownership and direction of **source-code dependencies**, distinct from runtime calls, DI or mere adapters.

**New hypothesis:** hold Telegram, news content, request and a *single hypothetical API-breaking change* constant. Before inversion, the high-level `agent-workflow.ts` must change. After a one-time refactor it owns the domain-specific rule “Опубликовать выпуск” and a `telegram-adapter.ts` depends on that rule. With the identical Telegram change, only adapter code must change; errors do not disappear automatically. Visual evidence must highlight the file/contract boundary (who is edited) rather than merely flipping destination cards. Counterexample: app systems with no direct service-dependent high-level code already have separation, so the hypothetical failing version must explicitly establish real direct coupling.

**Artifacts:** [corrected v2 storyboard](../storyboards/AGENT_PUBLISHER_SCRIPT_V2_DIP.md), [source/research critique](2026-11-23-dip-script-critique-05.md), v1 marked rejected. **Script only; no runtime/UI changes, tests or deployment were executed in this correction**. The current production's shortcomings remain until actual implementation and human evaluation.

## 2026-11-23 · Creative Loop 06 · First serial content-factory product

**Owner goal:** progressive series about the content factory with **each screenplay written, independently web-reviewed, then the next scripted**, four interactive episodes and one manual deployment. Source: `docs/series/season-01/{01-one-post,02-both-channels,03-who-sets-rules,04-swap-writer}.md`, plus the bible and `docs/creative-loop/2026-11-23-content-factory-season-06.md`. Narrative progresses **duplication/SRP → publish composition → DIP contract ownership → DI ready tools**.

**Actual lesson:** one continuous fictional editor story does not make all architecture patterns equivalent. Use different *observable consequences* for each: incorrect regenerated date, partial delivery per channel, site-specific edit location, and substituted executed writer. Underlying model provider does not spontaneously remember or create integration tools.

**Build-observed mistake:** initial new tests failed 3/113 because they demanded a single text match when both chat and artifact legitimately displayed Sunday, one status when two true statuses existed, and incorrect case for a label. Fixed the assertions to inspect meaningful values and receipts, not incidental unique strings. Later full run 114/114 PASS, 15/15 jsdom UI tests, pinned Vanya UI inspect/check/verify, TypeScript/Vite, licensing, Cloudflare Worker version `5f0d26b0-65ad-4a23-a79f-50f426758566`.

**Source-observed architecture defect repaired:** local browser `Publisher` side effects were being invoked during React rendering. Changed to click-owned execution and stored results. Simulated site failure and retry now call only the failing site adapter, retaining the same Telegram receipt object; actual source tests assert object identity. **This proves local educational behavior, not external exactly-once semantics**.

**Limits:** mobile screenshots, 200% zoom, human comprehension, actual rendered browser and owner artistic acceptance NOT VERIFIED. New tool extraction verdict REUSE rather than inventing a generic engine. Future loop must replay these lessons before new storyboard/code.
