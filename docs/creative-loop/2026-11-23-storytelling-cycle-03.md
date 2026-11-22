# Aha! · Creative Loop 03 · Dramaturgy, copy, Vanya UI · 2026-11-23

**Consumer:** `VanDalkvist/dependency-inversion`, existing Draft PR [#1](https://github.com/VanDalkvist/dependency-inversion/pull/1) on `feat/ioc-creative-loop-ux-20261122`. Public repository; source-owned research contains no personal identifiers, tokens or copied proprietary source. **One full cycle**, adapting the owner's [game-tools/world-creative-loop](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/SKILL.md) to an interactive explanatory story rather than a playable Godot world.

**Direct owner feedback, grade A:** first line of published home page began `Как не привязать помощника к одному сервису?` and created confusion. Owner explicitly rejects negative, abstract openings and calls the result an instructional questionnaire rather than storytelling; asks for source-backed storytelling research, direct Sarycheva editing, and real contemporary Vanya UI components, not CSS imitations.

## 0. Memory replay: what previous loops missed

Read **before** proposing: current Draft PR source `StoryPlayer/GuidedExperience/FocusedVisual/guided-copy`, `docs/creative-loop/MEMORY.md`, Cycle 02 research/critique/handoff and `ACTIVE_CYCLE.json`, as well as the current [game-tools one-run contract](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/CONTINUATION.md), [static review](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/STATIC_REVIEW.md), [playability proof](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/PLAYABILITY_PROOF.md) and [failure-pattern atlas](https://github.com/VanDalkvist/game-tools/blob/main/skills/world-creative-loop/FAILURE_PATTERNS.md).

- **APPLY:** previous owner-observed failure was caused by the *shell* demanding that newcomers learn a player/graph UI. Keep technical depth optional and preserve actual service outputs.
- **SUPERSEDE:** “a human-sounding question is a story”. In Cycle 02, nine consecutive question/answer pages with a status board were marketed as storytelling; this user's explicit new response refutes that framing. The narrative now requires a named actor, a concrete change in circumstances, a choice and a visible consequence.
- **APPLY:** 100 green tests are evidence for code, *not* for the first sentence or an interested viewer. Add copy-level negative-first, novice opening and DOM use-of-real-component tests.
- **SUPERSEDE:** nine novice beats are acceptable because the technical model has nine scenes. The novice journey can be an authored subset; old technical learning remains accessible separately.
- **SKIP:** new logo, new renderer, animations for animation's sake, or a new proprietary UI-kit. The selected Vanya Arc / Aha! impulse identity is already approved.

## 1. NMT: real Job and causal gap

**Who/when:** a curious parent, author or creative who has heard of AI agents but has never thought about dependency interfaces opens a short interactive story.

**Job:** “I want to watch somebody using an AI assistant, see a concrete snag when publishing news to another channel, and try the change myself so I recognize a reusable idea for my own assistant.”

**Trigger / task / alternatives:** entry to Aha! after a link or a recommendation; read a two-minute comic/video, ask an LLM, read source code or exit. The interactive story must earn the extra taps by changing something visible and explaining its consequence.

**Breakdown / whys:**
1. The page starts with an abstract *negative* question; the reader has no experience or stake to attach to it.
2. Every slide asks another architecture-flavored question; there is no person dealing with an event.
3. Screens show an idealized structural diagram and identical boxes, so the viewer cannot feel an actual change to a document.
4. The previous assistant optimized for preserving testable existing `StoryScene` mechanics, instead of selecting which parts of them serve a story.
5. Root hypothesis: **a lesson architecture was mistaken for a narrative arc**. Correct the dramatic unit to *an event changing someone's plan* and use technical scenes as optional depth.

**Smallest falsifiable RAT:** first-time non-programming reader reads heading + two paragraphs without any preface: can they say **who did what**, **what new task arrived**, and **what the story might let them change**? At 30–90 seconds, can they identify which publication channel changed while the content remained the same? Conduct 3–5 observed sessions; **NOT RUN** in this coding cycle. Do not infer understanding from any test count.

## 2. Research: real references and narrow adaptations

### Story construction and interactive learning

- [Nielsen Norman Group, UX Stories Communicate Designs](https://www.nngroup.com/articles/ux-stories/): narrate the person's goal and motivation, not a dry sequence of requirements. **Use:** a fictional news editor Anya with a released bulletin and a new demand to republish.
- [NN/g Two Tips for Better UX Storytelling](https://www.nngroup.com/articles/two-tips-better-ux-storytelling/): the **story mountain** and engaging conversation. **Use:** status quo → disruption → attempt → new organizing rule → changed outcome, not a list of terms.
- [Julian Shapiro, How to tell a great story](https://www.julian.com/blog/storytelling), [Writing Well: rewriting](https://www.julian.com/guide/write/rewriting): specificity and curiosity before abstraction. **Use:** nine-o'clock bulletin, lunch request, Telegram and website; no invented *actual customer* or real publication claim.
- [Wait But Why, Why Procrastinators Procrastinate](https://waitbutwhy.com/2013/10/why-procrastinators-procrastinate.html): a recurring recognizable subject makes the system easier to follow. **Transfer:** same physical bulletin prop recurs across episodes, without copying original art/characters.
- [NN/g Narrative Biases](https://www.nngroup.com/articles/narrative-biases/): a plausible story is not empirical evidence. **Constraint:** Anya is an explicitly fictional character and the lesson's external publication is simulated.

### Sarycheva / Arkhipov, **direct primary skills read**

- [redaktura/SKILL.md](https://github.com/N1arko/redaktura-skills/blob/main/redaktura/SKILL.md): edit **meaning/facts → structure → tone → sentence → word → rhythm → AI traces**, not superficial stop-word removal. **Applied:** replaced entire first-person-free architecture problem with action and consequence; avoided fabricated services/results.
- [statya/SKILL.md](https://github.com/N1arko/redaktura-skills/blob/main/statya/SKILL.md): article dramaturgy = character, conflict, intrigue, detail, disrupted expectation and natural rhythm. **Applied:** Anya's first bulletin / site request / a failed attempt / channel change.
- [ux-copy/SKILL.md](https://github.com/N1arko/redaktura-skills/blob/main/ux-copy/SKILL.md) and [UX element guidance](https://github.com/N1arko/redaktura-skills/blob/main/ux-copy/references/elementy.md): scenario ahead of interface; labels describe actual next outcome rather than `Далее`. **Applied:** “Открыть новую задачу” and “Подключить сайт по новым правилам”.
- [neirotekst](https://github.com/N1arko/redaktura-skills/blob/main/redaktura/references/neirotekst.md), [ритм](https://github.com/N1arko/redaktura-skills/blob/main/redaktura/references/ritm.md), [структура](https://github.com/N1arko/redaktura-skills/blob/main/redaktura/references/struktura.md): reject repeated `не X, а Y` rhetorical reversals, judgmental labels and mechanical sentence rhythms. **Applied:** concrete chronological prose rather than “Теперь ты знаешь главный принцип” and long declarative moralizing.
- The original skills are by **Людмила Сарычева и Никита Архипов**, license CC BY 4.0 at source. The book [Ильяхов и Сарычева, «Пиши, сокращай»](https://bureau.ru/books/pishi/) is a separate copyrighted work; **no third-party skill text or page art is copied into this repository**.

### Actual Vanya UI, not a kit imitation

Read canonical [Vanya UI skill](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/skills/vanya-ui/SKILL.md), [exports](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/index.ts), [ActionButton](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/components/ActionButton.tsx), [ThemeToggle](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/components/ThemeToggle.tsx), [WorkflowStrip](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/components/WorkflowStrip.tsx), [CraftCard](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/components/CraftCard.tsx), [Tag](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/src/components/Tag.tsx), [typography](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/docs/patterns/typography.md), [action feedback](https://github.com/VanDalkvist/vanya-ui/blob/8a39e86fc276aa0b75726f308a00fdefd0b30934/docs/patterns/action-feedback.md).

**Build approach:** pin this reviewed SHA in the manual CI's sibling `vanya-ui` checkout. Import real JSX components, don't clone their markup/hover/keyboard semantics. Reuse `@vanya/ui/tokens.css`; use local CSS only for narrative layout/typography and a document/receiving-channel art direction. Local source dependency was already `file:../vanya-ui`; re-use it.

**Motion:** [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) and [AnimatePresence](https://motion.dev/docs/react-animate-presence). Animate state of *actual* selected channel / changed bulletin, not random particle effects. Disable transform effects when user requested reduced motion.

## 3–5. DEFINE: 12 materially different alternatives, TRIZ and adversarial critic

Desired MDA experience: “I know what happened to Anya, I can change the result, and I see that the same bulletin works with different channels.” Mechanics must support reader attention and actual mutations, not badges of completion.

| # | Direction | TRIZ tension & experience mechanism | Single-agent adversarial verdict |
|---|---|---|---|
| 01 | Generic “Как не привязать…” hero with friendlier subhead | Change a few words while preserving an abstraction | **VETO**: past direct owner failure |
| 02 | Start at 9:00 with a fictional editor's successful bulletin | Put a person/action/time before an abstract rule; recognizable artifact | **ACCEPT** |
| 03 | Hero starts with an accident or broken app error | Drama by artificial urgency | **VETO**: no source-backed incident; sensationalizes |
| 04 | Two branching books with entirely unique implementations | Meaningful dramatic agency vs technical duplication | **REWORK**: preserve one authoritative service pipeline |
| 05 | Same news-sheet visual moves to Telegram and website | Artifact stays constant while recipient changes; real state in selected channel | **ACCEPT** |
| 06 | Auto narration with voices and mandatory autoplay | Emotional polish vs control of pace | **VETO**: returns playback friction |
| 07 | Vanya UI component collage as a theme demo | Beautiful but competes with human story | **VETO**: product should not become a showcase |
| 08 | Use real Vanya UI surfaces and utility controls around one editorial prop | Real shared design language with app-specific narrative composition | **ACCEPT** |
| 09 | Keep nine lesson-model scenes for experts, author a 5–6 beat novice edit | Depth vs first-use fatigue; separate in time | **ACCEPT** |
| 10 | “Next” becomes a description of the next event | Reader knows what the action will reveal, rather than generic “Далее” | **ACCEPT** |
| 11 | Show a full source-code card first for credibility | Accurate but inaccessible; user must learn types before story | **VETO** |
| 12 | End on another actual choice with an optional sandbox | User can modify next bulletin after conclusion | **ACCEPT with caution**: don't claim live publication |

**Critic mode:** `adversarial-pass` by the same agent, **not an independent external review**. The critic's gate: with Motion removed, is there still a person, concrete goal, meaningful next choice, observable result? Rejected 01/03/06/07/11. Prior fast UI interview evidence is a reason to reject up-front tech terms, not a tested validation of this edit.

**TRIZ:** inversion (story first rather than concept name), subtraction (short reader timeline), separation in time (expert graph later), local quality (hero text vs prop; do not animate both equally), one recurrent object (same bulletin turns from Telegram to website), and actual source-first reuse.

## 6. MAKE: what changed in the source

- `src/player/guided-copy.ts`: rewrite the *whole* DI and DIP story, titles, stakes, event-specific CTA, feedback and recovery in Russian. All old technical action IDs preserved; fiction explicitly disclosed.
- `src/stories/{di,dip}/index.ts`: positive first-person story hooks and curated `guidedScenes`; **five** novice DI beats, **six** DIP beats, unchanged nine expert scenes.
- `src/player/contracts.ts`: optional guided scene IDs in StoryDefinition; `StoryPlayer` continues managing one authoritative playback reducer.
- `src/player/GuidedExperience.tsx`: **actual** `WorkflowStrip/ActionButton/ThemeToggle` source exports, reader-only subset of scenes, `seek` for next/back across hidden technical beats, true state/result preservation on expert switch, the final real `ExperimentPanel`.
- `src/player/FocusedVisual.tsx`: **actual** Vanya `CraftCard/Tag`, same news-sheet across every beat, derived from actual `PlaybackState.results/answers`; Motion and reduced-motion support.
- `src/player/guided.css`: desktop editorial visual composition + mobile reading flow; readable 18–21 px explanatory text, high-contrast action area. Local CSS decorates product-owned story props but doesn't recreate Vanya UI component APIs.
- `UI_CONTRACT.md`: portable pointer to canonical Vanya UI skill, pinned SHA; `scripts/cloudflare-release-build.mjs`: remote actual `inspect` and `check` gates, single React hook runtime for linked source workspace; `package.json`: `test:ui` as a **jsdom UI-component journey test**, not a real browser.

## 7. Proof / honest execution status

The exact build ID, test failures/repairs and release status are appended in the **final handoff** and source-reviewed before the last `ACTIVE_CYCLE.json` update. A green build is not a successful observational comprehension test.

Important negatives: Browser tabs connector is unavailable without the originating browser context. Actual Cloudflare Browser Rendering access had a documented 429 earlier. No screenshot or 320px/mobile/keyboard/zoom audit is claimed without a current matching source/version receipt. Human RAT: **NOT RUN**.

## 7.5. Static source arch/product review checklist

1. **Traceability**: `App -> lessons -> StoryPlayer -> GuidedExperience -> answerEvent/presentScene -> playback -> original story.perform -> assembleFactory/runFactory` on DI, DIP action state retained. A drawn publication is always labeled a fictional story; a *real* browser-side document only after `run`.
2. **Single runtime owner**: `guidedScenes` stores indices, not a new business logic state machine. Keep `PlaybackState` authoritative when returning from technical mode; no parallel persistence or server added.
3. **Entrypoints**: `/` is DIP, `/di/` is DI; both guided mode and explicit expert mode address the same real story definitions.
4. **Implementation completeness**: CTAs dispatch actual action/seek; wrong choices keep gate; values and artifacts derived from real reducer outcomes. Negative checks for empty UI, hidden target, “Next” to skipped scene, actual channel swap, repeated clicks.
5. **P1 visual/semantics constraints**: Vanya UI `ActionButton` only for interactive actions; `CraftCard` presentation only; legitimate `Tag` and `WorkflowStrip`, no self-painted fake status; reduced motion; focus recovery; native page scroll; target viewports 1440×900, 1024×768, 390×844, 320×568 and 200% zoom.

## 7.6. LEARN / 7.7. TOOL SCOUT

**Durable process change:** after writing an instructional narrative, strip out the diagram and read aloud **only the headings**. If they don't give a hero → event → obstacle → attempt → change, the project still has lesson labels and needs a different dramatic structure. Sarycheva redaktura's **meaning before words** pass should happen before polish or component choice. Still a hypothesis about future consumers, supported by the owner rejection plus source change, not user-test proof.

**Tool extraction:** `REUSE` (Sarycheva UX-copy and redaktura source, Vanya UI kit, game-tools creative loop, Motion). No evidence of a second consumer for a new story engine and no owner request for a new framework. Do not extract or modify `game-tools` or `vanya-ui` in this run.

## 8. Return

**Deliverable is one coherent revised experience** on both DIP and DI, not five unrelated effects. The owner has explicitly requested source implementation/release on the existing Draft PR; leave `main` and PR status unchanged.

**Open empirical decision:** read-only first minute and actual channel change must be watched by the owner or independent non-programmers. If story still feels like a quiz, redesign the *choice grammar*, not the logo or number of components.
