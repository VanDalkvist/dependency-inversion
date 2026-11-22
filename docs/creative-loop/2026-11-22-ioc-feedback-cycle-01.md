# IOC Film · Creative Loop 01 · 2026-11-22

**Consumer:** VanDalkvist/dependency-inversion · **target:** `/di/` (plus reusable player and `/`).
**Base:** `b2b2a870846e56c617c8c8a00bf1dd106c75946a` · **PR:** [#1](https://github.com/VanDalkvist/dependency-inversion/pull/1) · **release:** NOT DEPLOYED.
**Method:** [World Creative Loop](https://github.com/VanDalkvist/game-tools/blob/f34a7aad1a934dfae3a36fd19b630b3a1b5dda79/skills/world-creative-loop/SKILL.md), adapted from game-world creation to an interactive educational film. No artificial five-game-experience quota; count independently useful viewer-facing changes, not animations/commits.
**Evidence status:** code is committed and source-reviewed, but build, automated browser runs and new viewer tests were **NOT RUN**, so this iteration is **NOT VERIFIED**. This is not a claim of completed black-box UX validation.

## 0 · Source reality / memory replay

Read consumer source (`src/player/{StoryPlayer,Narration,Stage,Transport,playback,usePlayback,layout.css}`, `src/stories/di/*`, `src/stories/dip/index.ts`, `src/App.test.tsx`) and reusable method, plus Vanya UI agent skill. No earlier project-owned creative-loop cycle/memory found in the IOC tree: **NO_MEMORY**. Do not extrapolate successful learning from undocumented prior iterations.

Owner's direct feedback (2026-11-12, grade A) asks for a short, understandable, reusable demonstration of design patterns **as ways of thinking when building agents** for people without programming backgrounds. Two review responses, paraphrased (grade B): a beautiful but overwhelming first screen, no visible starting point, unfamiliar terminology, interactive changes without an intelligible story. Owner also identified repeated manual Play after interactions. This is small qualitative input, not a representative usability sample; no interviews were conducted during this run.

Existing asset: a real DI demonstration wired to `assembly.ts`, actual alternative source/writer/publisher implementations, stage graphs and preserved tests. The graph is complex; the repository already uses `motion/react`. Don't replace its working model with a fake animation.

## 1 · DISCOVER: NMT / job-to-experience

**Situation/trigger:** curious person hears that programming patterns can make AI helpers easier to change, opens a short interactive explanation with no prior API vocabulary.

**Job:** “Понять на одном знакомом примере, как я могу менять инструменты AI-помощника, не строя всё заново; сразу представить, где это применить”.

**Verb:** choose a tool → see a concrete change → explain the principle in own words.

**Competing alternatives:** watch a two-minute plain-language video; read a story with pictures; ask a friend; ignore because it looks like a developer tool.

**Breakdown:** initial conceptual tax (“dependency injection”, “Publisher”, “контракт”, code graph), simultaneous panels, no obvious primary action, stop/restart playback. More graphics or more explanations in parallel exacerbate this.

**Why ladder:** “Не понимаю” → too many rival attentional targets → unfamiliar graph before familiar purpose → interaction is detached from a recognizable consequence → viewer has no reason to acquire the concept. Product goal is **recognizable agency**, not completing nine quiz screens.

**Positive RAT:** in an unassisted first 60 seconds, at least 3 of 5 non-programmers independently (a) identify what is being assembled, (b) click an appropriate first action without being told how, (c) say that the helper stays the same when the channel changes. **Falsifier:** they click blocks but can only report “карточки двигаются”; don't claim this RAT passed without actual observation.

## 2 · RESEARCH, with specific transfers

| Reference | Transfer, not copying |
|---|---|
| [Wait But Why: Why Procrastinators Procrastinate](https://waitbutwhy.com/2013/10/why-procrastinators-procrastinate.html) | Familiar problem and simple recurring characters before an abstraction; **do not** copy its drawings/personas |
| [Julian Shapiro: Writing Well](https://www.julian.com/guide/write/intro) and [rewriting](https://www.julian.com/guide/write/rewriting) | Promise a meaningful outcome immediately; simplify the explanation, not just individual jargon |
| [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Hide optional explanations and advanced controls until wanted; keep the current task obvious |
| [NN/g: Heuristics for complex applications](https://www.nngroup.com/articles/usability-heuristics-complex-applications/) | In-context guidance and clear feedback instead of a manual |
| [Motion for React: reduced motion](https://motion.dev/docs/react-use-reduced-motion) | Animate meaningful changes with accessible defaults |
| [Bablo motion source](https://github.com/VanDalkvist/knopka-bablo/blob/main/app/src/motion.css) and [package](https://github.com/VanDalkvist/knopka-bablo/blob/main/app/package.json) | `motion` for component reactions + CSS keyframes for theatrical loops. IOC already has Motion, so **reuse**, do not add or clone Bablo's money-printer animation |
| [Vanya UI canonical skill](https://github.com/VanDalkvist/vanya-ui/blob/main/skills/vanya-ui/SKILL.md) | Screen hierarchy, scroll ownership, real tokens/exports and local inspect/check/verify gate |

The reference URL for a film on the web is not evidence that its audience comprehends the new layout; no video or human test here.

## 3–5 · DEFINE / divergent ideas / MDA / adversarial critic

All proposals share the same positive RAT above unless otherwise noted. This is a single-agent adversarial pass, **not an independent critic**.

| # | Candidate; tension / TRIZ | Feeling → mechanism / observable consequence | Critic |
|---|---|---|---|
| 01 | Familiar question before the label; abstraction vs accessibility / inversion | Recognize a personal problem → hook: helper with changeable tools → know what to watch | **ACCEPT; implemented** |
| 02 | One purposeful first choice; exploratory richness vs clarity / subtraction | “I have a move” → source-owned scenario asks who connects tools → action changes graph | **ACCEPT; implemented** |
| 03 | Continuity after successful choice; agency vs interruption / dynamization | No extra Play → conditional resume and short effect dwell → next scene flows | **ACCEPT; implemented** |
| 04 | Explicit faster next; pacing vs speed / local quality | Reader decides → “Дальше сейчас” continues and starts next scene → no repeated Play | **ACCEPT; implemented** |
| 05 | Optional graph legend; expertise vs first-use overload / subtraction | Uncluttered stage → `details` disclosure → technical legend reachable, not mandatory | **ACCEPT; implemented** |
| 06 | Meaningful component movement; delight vs comprehension / local quality | See that blocks change → small Motion spring on stage nodes, respects reduced motion | **ACCEPT; implemented as small tweak; impact unverified** |
| 07 | Entire story as passive autoplay video; easy entry vs ability to experiment | Low interaction, but cannot try alternate channels or return to inspect | **VETO** |
| 08 | Giant glossary overlay at entry; familiarity vs detail | More words instead of purpose, harder first impression | **VETO** |
| 09 | Bablo-style money particle celebration for each click | Flashy without explaining tool replacement; introduces cognitive noise | **VETO** |
| 10 | Mandatory onboarding modal / forced guided tour | Hides navigation and traps returning viewers | **REWORK**: contextual cues only |
| 11 | Multiple animated metaphors for every kind of connector | Expensive and may lose exact correspondence to real `assembly.ts` | **DEFER** pending audience comprehension test |
| 12 | Short standalone micro-films for each concept | Promising but major information architecture change, no evidence this fixes first 30s | **DEFER** pending RAT |

**MDA in reverse (one complete interaction):** desired experience = “я понял, что могу заменить инструмент, не переписывая процесс”; dynamic = pick source/writer/channel, run, change just publisher, compare resulting document; mechanics = existing `assembleFactory` and `runDigest`, stage SVG projections, action events, outcomes. 30–90 second slice: recognizable hook → choose an outside tool → visible configuration change → launch → swap channel → changed artifact. Existing DI has nine scenes; the hypothesis may still be too slow; **don't call it solved**.

## 6 · MAKE: actual changes

Source locations in PR #1:
- `src/stories/{di,dip}/index.ts`: problem-first hooks, purpose and understandable chapter names.
- `src/stories/di/{assembly-scenes,execution-scenes}.ts`: plain-language explanations without changing existing action IDs or real execution.
- `src/player/{StoryPlayer,Narration,layout.css}`: clear intro hierarchy, contextual “Твой ход”, optional schema key, mobile narrative stays visible after choices, explicit “посмотреть, что изменилось”, and advance control.
- `src/player/{playback,Stage}.ts(x)`: correct choice continues automatically; open/close inspector remembers playback; explicit continue starts next scene; motion responds to graph state with `useReducedMotion`.
- `src/{App,lessons,Injection}.test.tsx` and `src/player/playback.test.ts`: expected revised titles and new regression cases. **Written, NOT RUN**.

## 7 · PROOF / technical receipts

- Read live IOC repository, created dedicated branch and Draft PR #1; code changes are **COMMITTED**.
- Source-only code review and fresh PR diff performed; found two unclosed conditional JSX blocks in `StoryPlayer.tsx` and `Narration.tsx`, repaired in commit `019800215e4de4f697fa519bcbf21eb13c91fe00` (Narration preceding `d5c59d3bedf4ffb2d290f2e96d194334b87e3136`).
- Browser screenshot/readback of `ioc.vanya-arc.dev`: **NOT RUN**. Site deployment: **NOT DONE**. `npm test`, `npm run build`, portable Vanya UI `check/verify`: **NOT RUN** (no checked-out IOC/Vanya UI workspace in this connected-source session). No human comprehension playtest was performed; no accessibility audit claim.

## 7.5 · STATIC ARCH + product review (SOURCE REVIEWED ≠ PASS)

**Dependency traceability:** `App.tsx → StoryPlayer → usePlayback/playback`; real `src/stories/di/scene-actions.ts` invokes `interaction.answerEvent → action.perform → assembly/execute`; existing service contracts remain authoritative. No invented backend.

**Runtime completeness:** no parallel second playback store. New `resumeAfterInspect` belongs to existing reducer and resets on seek/pause. Viewer-focused additions extend the generic story fields, not hardcoded DI branches in the player.

**Entrypoint wiring:** `lessons.ts` routes `/di/` and `/` to same generic player; motion targets existing `Stage` nodes and existing story actions. `continue` is a real reducer event.

**Implementation completeness:** controls dispatch concrete events; no fake progress. A correct action continues and retains its selected result; a wrong choice stays gated; inspection only resumes if playback was active.

**Source-inferred journeys (not real user observations):**
- **Cold start:** explicit familiar hook, story goal and “Твой ход”; no need to parse legend.
- **Happy path:** choose outside services → optional diagram → next with automatic play → run and compare output.
- **Recovery/repetition:** incorrect answer leaves gate; inspector returns to prior state; seek intentionally pauses and rewinds choices; mobile resets to narrative on scene changes.

| Finding | Evidence / severity | Decision |
|---|---|---|
| Conditional JSX closing syntax accidentally omitted during editing | `src/player/StoryPlayer.tsx`, `Narration.tsx` · P0 compile | **FIX NOW**, corrected and re-read |
| Answer forcibly opened graph and hid feedback on mobile | `src/player/StoryPlayer.tsx` initial source · P1 first-use | **FIX NOW**, keep text and offer optional graph |
| Manual “next” used seek and would still need Play | `playback.ts` + `Narration.tsx` · P1 | **FIX NOW**, dedicated `continue` event |
| Nine scenes and dense diagrams still constitute cognitive load | `src/stories/di/*`, `Stage.tsx` · P2 product hypothesis | **LOG ONLY**, validate against novice RAT before bigger redesign |
| 6-second default automatic transition may cut off slow readers, with no countdown | `playback.ts` · P2 **unverified** pacing risk | **LOG ONLY**; observe real reading time; add stop/cancel or pacing if needed |
| Existing `@vanya/ui` uses local file dependency; no workspace mounted | `package.json` · verification blocker | **BLOCKED** here; use original multi-repo local checkout |
| Visual composition 1440×900, 390×844; reduced-motion in live browser | `layout.css`, `Stage.tsx` · runtime unknown | **NOT VERIFIED**, needs screenshots and interaction |

No black-box S9 review, formal architecture verdict or build PASS is claimed. This single-agent critic cannot be called independent review.

## 7.6 · LEARN

**Tentative principle, not proof:** for non-developers, a known purpose and visible change should precede the technical name. The owner-provided feedback supports trying this; the new implementation needs real observation before it is accepted. **Negative evidence:** beauty alone did not create comprehension; therefore no purely decorative motion candidate passed the critic.

## 7.7 · TOOL SCOUT

**REUSE:** existing Motion in IOC, Vanya UI, generic StoryPlayer and the canonical creative-loop skill. No demonstrated independent second consumer of a new film-specific primitive. **SKIP** extracting new library/tool, **SKIP** creating an IOC-specific agent harness. The source of truth for research and handoff is this repo.

## 8 · RETURN / next acceptance gate

Keep PR #1 **DRAFT** and main unchanged. On a machine with both `dependency-inversion` and `vanya-ui` next to each other, run `npm install` only if needed, `npm test`, `npm run build`, `node ../vanya-ui/scripts/ui-pipeline.mjs inspect --project .`, `check` and `verify`. Then review actual screenshots at 1440×900 / 1024×768 / 390×844 / 320×568, mobile action → feedback → graph → next, keyboard, reduced motion, focus/scroll, direct `/di/` URL, wrong choice and replay. Have 3–5 **non-programmers** explain what changed at the end. Record failures; only then judge release readiness.

**Open strategic question:** should this be a film that is **interrupted occasionally by a choice**, rather than a diagram tool with an embedded film? This is a second independent creative hypothesis, not something confirmed by source inspection.
