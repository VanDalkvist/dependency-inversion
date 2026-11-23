# Aha! · Creative Loop 02 · First-time viewer product rebuild · 2026-11-23

**Consumer:** `VanDalkvist/dependency-inversion`, Draft [PR #1](https://github.com/VanDalkvist/dependency-inversion/pull/1), branch `feat/ioc-creative-loop-ux-20261122`.  
**Source trigger:** direct owner criticism after the previous cycle and the public 22.11.2026 release: only the logo visibly changed; the type was still microscopic; multiple panes/chapters/playback controls all competed; the original 12 November user interview feedback had not been resolved.  
**Method:** [World Creative Loop](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/SKILL.md), adapted from a game-world experience to an explanatory interactive film. **Single-agent adversarial critic, not independent external review.**

## 0. Memory replay / old hypothesis falsified

Sources re-read before discovery: [prior source-owned cycle](2026-11-22-ioc-feedback-cycle-01.md), [actual released handoff](HANDOFF.md), `ACTIVE_CYCLE.json`, live `StoryPlayer/Narration/Transport/Stage/layout.css`, both story definitions and action reducers.

- **SUPERSEDE:** “one centered card on first frame + gradual SVG nodes is enough to fix overload.” Owner explicitly reports it was not enough; even without nodes, the control shell and tiny type remained.
- **SUPERSEDE:** passing 92/92 unit tests proves a worthwhile UX. Those tested source logic, not where a novice looks in the first five seconds; the owner is contrary observational evidence.
- **APPLY:** a familiar helper before names DIP/DI; preserve actual real service execution rather than animated fakery.
- **APPLY:** reader should not need to press Play repeatedly; remove the film playback paradigm entirely for the primary journey.
- **SKIP:** purely decorative Motion polish and rebranding; the owner has already chosen the impulse logo and wants an interaction redesign, not another art cycle.

## 1. NMT-inspired discovery: what does a person hire this for?

**Trigger / situation:** a non-programmer interested in AI agents opens an unfamiliar interactive explanation on a desktop or phone.

**Job / verb:** “Хочу на одном понятном примере **увидеть**, как один помощник умеет менять инструменты, чтобы представить такое в собственном агенте.”

**Desired success:** viewer predicts that replacing the publishing channel won't force a rewrite of the assistant; can say that in their own language and identify which option to click without instruction.

**Alternative:** a short explainer video (passive, zero UI tax); a one-screen cartoon; asking a language model; closing the page if technical.

**Job break: five whys**
1. Why did viewers not know what to do? → Several equally emphatic controls, a graph and a timeline were visible before a simple instruction.
2. Why so many controls? → The author treated all developer-facing capabilities as part of the first experience.
3. Why did simplification fail last cycle? → It changed the content of the graph but left the container and player controls intact.
4. Why a player at all? → The original technical prototype assumed the user wanted to operate a diagram inspector.
5. What should replace it? → A self-paced causal story in which the *only* prominent input is the next choice and the graph/code become optional depth.

**RAT positive criterion:** without help, at least 3/5 new non-programming viewers identify the next input in under 10 seconds, explain why it matters within one minute and can name what stays unchanged when a channel is swapped. **Not run**; owner feedback is n=1 direct product failure, not a representative field study.

## 2. Research: three independent axes

| Axis and source | Actual transfer | Non-transfer |
| --- | --- | --- |
| [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) and [complex applications](https://www.nngroup.com/articles/complex-application-design/) | Show only one high-priority job; defer secondary modes, examples and code | Do not hide the *primary action* or pretend hidden complexity vanished |
| [Mayer Segmenting Principle](https://www.cambridge.org/core/books/abs/multimedia-learning/segmenting-principle/37240877DDA0362355ADB39936027982), [split-attention](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/splitattention-principle-in-multimedia-learning/194CBCD1A3C911116CCB5F403AC7E415) | Small learner-paced beats, no unattended countdown while reading | Do not make each segment tiny 10px or animate competing areas |
| [DWP accessibility manual: one thing per page](https://accessibility-manual.dwp.gov.uk/guidance-for-your-job-role/interaction-designer) | One question/decision per step, clear visible action | Not every form pattern is appropriate for a film |
| [Motion React accessibility](https://motion.dev/docs/react-accessibility) and [AnimatePresence](https://motion.dev/docs/react-animate-presence) | Short keyed transitions and persistent result changes; reduced-motion support | No decorative infinite particles, auto panning or forced motion |
| [Wait But Why](https://waitbutwhy.com/2013/10/why-procrastinators-procrastinate.html) and [Julian Shapiro's writing approach](https://www.julian.com/guide/write/intro) | Familiar concrete story and question before definitions | No copied drawings or phrasing |
| Existing source `src/stories/di/assembly.ts`, `lesson-model.ts`, `content-factory/*`; [Vanya UI](https://github.com/VanDalkvist/vanya-ui) | Keep exact underlying action and output, colors/type token semantics and portable checks | Avoid a second fake scenario engine |

## 3–5. Brainstorm · 12 materially different candidates · critic VETO

Before selecting, every idea was challenged with “if I remove animation, will a viewer know what changes?” and the TRIZ tension “keep educational richness while **subtracting** visible controls”.

| # | Direction / primary mechanism | MDA: feeling → action → feedback | Critic |
|---|---|---|---|
| 1 | Full-screen autoplay animation with no controls | Effortless → watch → end; but no real choice, replay pain | **VETO**: weaker than a video |
| 2 | Onboarding overlay over existing controls | Told where to look → dismiss coachmark → same overloaded dashboard | **VETO**: explains confusion instead of removing it |
| 3 | Three-column reading, graph and code toggles | Expert depth → switch tabs → split attention | **VETO**: reproduces the failure |
| 4 | Minimal text-only article | Readable → scroll → static example | **REWORK**: good subtraction but loses cause/effect experiment |
| 5 | One viewport = one user-paced beat | Focus → make one decision → explicitly continue | **ACCEPT**: real interface change |
| 6 | Rewrite the entrance as a familiar AI helper problem | Recognition → decide who selects tools → concrete consequence | **ACCEPT** |
| 7 | Three large changing “get / write / send” slots | See what stays constant → choose source/editor/channel → only one part changes | **ACCEPT** |
| 8 | Replace diagram of imported interfaces with a plain causal chain in DIP | Predict → define shared publishing rule → channel adapts | **ACCEPT** |
| 9 | Make experimental/service options progressively visible | No catalog overwhelm → one context-specific choice → result updates | **ACCEPT** |
| 10 | Preserve full technical inspector but move it behind bottom disclosure | Experts still have source → opt into technical view | **ACCEPT with risk**: switching modes must not silently lose progress |
| 11 | Scale typography and switch to non-nested natural document scroll | Stop squinting → read without zoom/panel hunting → see next action | **ACCEPT** |
| 12 | Money-printer-style theatrical Motion and celebratory rays | Brief delight → spectacle → little causal understanding | **VETO**: decoration not comprehension |

**TRIZ:** subtraction (remove timeline, chapter row, view modes, fullscreen, inspectors from initial surface), separation in time (show technical capabilities only on request), local quality (one large current action, other steps quiet), dynamization (the *selected service label* moves/changes, not entire viewport), inversion (start at reader's job rather than code).

**Adversarial-pass finding:** the accepted design still contains nine authored scenes in each story. If actual viewers drop off before replacing the channel, a smaller 4–5 beat story should be tried next. Nine is not justified as an optimum. Also, an 18px CSS declaration is not visual proof; real 320px and 200% zoom screenshots remain necessary.

## 6. Make · experience-level changes, not animation count

1. **Cold start** → no technical graph or player toolbar; plain problem and obvious current choice; logo retained, technical terms deferred.
2. **Choice and consequence** → options invoke the original `answerEvent` and action `perform()`; invalid picks keep the current beat and explain why; correct choices reveal the consequence.
3. **Readable changing visual** → three large service roles for DI, changing publishing responsibility for DIP; Motion animates text/state transitions; no supplementary graphic legend.
4. **Reader pacing** → the guided reducer has no timer; choices never auto-advance; exactly one high-contrast Continue button appears once a beat is complete.
5. **Learning depth on demand** → original SVG graph, code inspector, film controls and research remain in explicit technical mode, not crowded into entry; source and end sandbox stay available.
6. **Responsive hierarchy** → 18–20px main copy, ~32–46px primary headings, 60–62px touch targets; on narrow screens task/actions move ahead of secondary illustration; no fixed full-screen or competing nested scrollbars.

**Source points:** `src/player/{GuidedExperience,FocusedVisual,guided-copy,guided.css,StoryPlayer}.tsx`, story-specific copy in `guided-copy.ts`, existing `playback.ts`/ `interaction.ts`/ `assembly.ts` unchanged. `REUSE.toml` marks source-backed authored expressive files as `LicenseRef-Aha-Film`; MIT engine remains MIT.

## 7. Proof and static audit

**Evidence so far:** new first-view and causality tests in `src/player/GuidedExperience.test.tsx`; legacy technical-mode tests adapted for explicit entry; actual Cloudflare Workers Builds pipeline with `npm test`, `tsc -b && vite build`, `npm run check:licensing` and guarded Wrangler release. Build logs and final verdict are recorded in the project handoff, not assumed here.

**Architecture/source review check list:**
- Dependency trace: `App → StoryPlayer → GuidedExperience → presentScene/answerEvent → story.action.perform → execute/assembleFactory/runFactory`; the illustration reads `state.answers` and actual `state.results`, not a pretend dataset.
- Split-brain: guided and technical modes are **mutually exclusive**. Both use the existing reducer, but progress transfer between modes is an open usability question; no new persisted service cache or backend.
- Entrypoints: both `/` (DIP) and `/di/` (DI) use the same generic StoryPlayer route.
- Implementation: buttons actually answer/advance; incorrect answer cannot unlock next; final sandbox uses original experiment model.
- Responsive P1 to check: 320×568, 390×844, 1440×900; no hidden primary choice, readable body, no overlay/scroll jumping.
- Accessibility P1 to check: accessible focus after scene transition, keyboard, screen-reader status, dark theme and prefers-reduced-motion. **CSS/source checks are not browser QA.**

**Critic verdict: SOURCE-PLAUSIBLE, HUMAN RAT NOT VERIFIED.** Do not claim a user understood, a screenshot was checked or a product problem is solved without observed people.

## 7.6 Learning / 7.7 Tool Scout

**Durable lesson (source + owner observation):** simplifying the *data inside an overloaded control shell* does not simplify the experience. Before polishing individual controls, ask whether a visitor must learn the shell just to begin; if so choose a different primary mode. This only generalizes to first-use instructional interfaces, not power tools for expert users.

**Tool extraction verdict: REUSE.** Reuse the existing Motion and Vanya UI and existing source-owned creative-loop. Do not extract a new framework for one IOC film; the guided story and project copy remain local. An abstract “focus storytelling” component would require a demonstrated second consumer and independent RAT evidence.

## 8. Return / honest acceptance

**Delivery target:** 5+ distinct viewer-facing changes; **implemented in source:** 6 types above. These are not six verified experiences.  
**Owner confirmation:** NOT RECEIVED. **Human RAT:** NOT RUN. **Visual browser QA:** NOT RUN because Cloudflare Browser Rendering was rate-limited in the previous release and direct browser connector was unavailable.  
**Next empirical test:** unprompted reader at `/di/`: where do they look in 10 seconds? can they choose without explanation? at the channel swap, can they tell what stayed unchanged? These observations determine whether to retain or further shorten the nine-beat story.

The final source-backed proof, repairs, residual risks and release status are included below. The authoritative checkpoint and handoff are updated in the same GitHub commit as this final report.

## 9. Final verification and post-implementation adversarial source review

### Real reproducible build evidence

**Source release:** `ddc7b940f4466067f8c64a0464d004c1d0ed712f`. Manual Cloudflare build `0fd737cb-8e01-486d-9db7-76443fa76b61` reported:

- Vitest: **21 test files, 100/100 tests passed**, including 8 new guided-first-use/real-run/technical-mode cases; all legacy expert-mode regressions still pass.
- `tsc -b && vite build`: **PASS**; two HTML outputs and shared client assets; a **nonblocking JS chunk-size warning** remains (>500kB, gzip approximately 160kB).
- `npm run check:licensing`: **PASS**, 23 reserved film/brand source files and 2 CC BY research reports. This does not equal an independently executed REUSE CLI audit.
- Cloudflare Wrangler: **successful production deployment** of Worker `ioc` to both custom domains, final version `0cb590bf-53c5-4df4-abd2-ec9be47ca576`; explicit “Deploy command completed” and “Build completed”.
- The prior full release `aca04512-4ba4-40ad-8dbd-8bed45ee18ba` also passed 100/100 and deployed as Worker version `f65a7fb2-b227-4144-ae43-c570fb4abed0`. The newer release includes subsequent source fixes for semantic progress and label contrast. Research/memory docs after the release do not alter runtime.

### Source review — four semantic probes

1. **Dependency traceability:** `src/player/StoryPlayer.tsx:25-44` → `GuidedExperience.tsx:21-54` → `presentScene/answerEvent` → unchanged `src/stories/di/lesson-model.ts` → `assembleFactory` and `runFactory`; no disconnected “pretend” story engine. `FocusedVisual.tsx:65-101` reflects the actual reducer's answer/result state, not hardcoded fake counts.
2. **Runtime/split-brain:** the guided and technical modes are mutually exclusive and use the same `playback` event semantics, not separate business result stores; `StoryPlayer.tsx:25-49` copies `PlaybackState` during a mode switch and disables ticking. A regression test proves the completed initial choice survives a round trip to the technical mode. **Remaining P2:** a long story and mode transitions have not been watched by a real novice.
3. **Entry point:** `App.tsx` and `lessons.ts` continue resolving `/` and `/di/`; by default `StoryPlayer` renders the new guided mode. Existing expert Stage/Inspector remain reachable only via explicit footer entry. No dead demo route; both HTML outputs built.
4. **Implementation completeness:** actual action IDs/perform results drive next state, incorrect answers block advancement, correct decisions reveal consequence without countdown; beginner receives no graph, playback timer, chapter bar or nested inspector. `GuidedExperience.test.tsx:19-131` exercises initial composition, wrong choice, explicit continuation, real configured run, DIP causality, optional deep mode and progress retention. **No fake human interview receipt.**

### Triage, bounded repairs and residual uncertainties

| Priority | Finding | Action / evidence |
|---|---|---|
| P0 | Initial asynchronous story tests failed because Motion exit elements are removed after an animation | **FIXED**: `findByRole/findByText` correctly await the visible state; build now 100/100 |
| P1 | First beginner experience had the old film control shell, unreadably small captions and split attention | **FIXED structurally**: `GuidedExperience` default, separate expert mode, `guided.css:5-378` with 18–20px copy and large choice controls; *UX effect still awaits users* |
| P1 | Switching to technical details discarded a beginner's completed choices | **FIXED** in `StoryPlayer` and `usePlayback`; explicit regression test |
| P1 | Scene transitions and answer feedback required attention/focus management | **MITIGATED**: continue gets focus after correct answer, scene heading focus after Motion completion, answer status announced, progressbar has semantic `aria-valuenow`. **Keyboard/screen reader not independently checked.** |
| P2 | Nine total episodes can exhaust viewer before arriving at the real channel swap | **OPEN product hypothesis**, test actual time-to-insight; don't add more UI |
| P2 | At 320×568 and 200% zoom the first decision may need a short page scroll | **NOT VERIFIED visually**. No screenshots/physical viewport metrics; the flow uses a natural single-column scroll rather than a hidden inner scroller |
| P2 | No 3–5-person novice comprehension RAT | **NOT RUN**. Owner's original negative evaluation is evidence against the previous interface, not confirmation of this one |
| P3 | Vite warns main JS chunk above 500 kB because expert controls still ship in main bundle | **LOG ONLY** until measured load; candidate dynamic import of expert player later |

No independent second critic context was available; the critic is accurately labeled an **adversarial self-pass**. The technical tests prove execution paths, *not* emotional comprehension.

### Learn and tool extraction

**Learning written to** [MEMORY.md](MEMORY.md): remove the control shell first, not merely graph nodes; prioritize the plain-language decision and visible consequence. **ToolExtraction: REUSE** existing `motion/react`, Vanya UI and the original reducer; no new library, CLI, cron or GitHub Action needed. The user has not accepted this redesign yet, so the acceptance gate remains open.

**Development cycle state: COMPLETE (implemented, source-reviewed, tests passed, deployed). Product UX validation: UNVERIFIED by independent novice viewers.**
