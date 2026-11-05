# Cycle 2 — verification

Author review, not independent acceptance. No other threads were created: live runtime requires explicit user authorization for thread delegation.

## Architecture verification

- Passed: AP-010, AP-011, AP-020, AP-025, AP-026, AP-029, AP-051, AP-054, AP-068, AP-069, AP-070, AP-074, AP-075, AP-076.
- Not applicable: DB, auth, migrations, network-provider reliability; this is a static local simulation.
- Dependency traceability: App injects dependencyInversionStory into StoryPlayer; player imports no concrete story. usePlayback drives actual state transitions. ExperimentPanel invokes the story-supplied run function. experiment.ts wires concrete adapters; pipeline.ts imports only owned contracts and invokes collect/write/publish.
- Runtime completeness: former coffee modules and tests removed, preserved in git history. No alternate old production entrypoint remains.
- Entry point wiring: main.tsx → App.tsx → StoryPlayer; sandbox → injected experiment → runDigest → concrete in-memory adapters.
- Anti-gaming: tests assert graph ownership, edge endpoints, generated document contents, duplicate removal, withheld publication, and actual timer state. No fake receipt IDs.
- Residual risk: no independent reviewer; no actual external API integration; another lesson is verified by a small injected fixture, not a second full authored film.
- VERDICT: PASS for author code review only.

## Product verification

- 27 tests include independent story rendering/replacement, rewind restoration, timeline seek, gate answers, timer cancellation, valid and invalid configurations, generated HTML, both themes.
- Build: TypeScript and Vite production build.
- Chrome: Publisher moves into policy region; direction explanation and separate runtime view.
- Chrome mobile: 390px viewport, no page overflow, graph horizontal scroll, prefers-reduced-motion.
- Chrome sandbox: aggregate source receives 4 inputs, emits 3 unique materials into 2 actual local documents; denial emits 0.
- npm audit: zero reported vulnerabilities.

## Findings fixed in this cycle

- [P2] Evidence: partial publisher inversion initially hid still-concrete RSS/LLM references. Impact: misleading teaching snapshot. Rule: AP-076. Fix decision: fix-now. Updated per-boundary labels and authored intermediate source fragments; semantic graph tests.
- [P2] Evidence: plain object membership accepted inherited config keys. Impact: incorrect configuration reached a concrete adapter. Rule: AP-012. Fix decision: fix-now. Object.hasOwn and regression test.
- [P2] Evidence: seek initially retained the current scene's resolved action. Impact: rewind could not replay the inversion. Rule: AP-054. Fix decision: fix-now. Rewind clears current/future scene answers; regression test.
- [P2] Evidence: replacing a story could keep an incompatible old index. Impact: reusable player session leaked across lessons. Rule: AP-051. Fix decision: fix-now. Session keyed by story.id; independent-story replacement test.
- [P3] Evidence: graph declaration is slightly over 250 lines. Impact: optional maintainability concern, no functional incompleteness. Rule: AP-019. Fix decision: log-only; graph data intentionally kept together for authorability.

## Copy slice — 2026-11-05

Author review, not independent acceptance. Reviewed the changed source and production UI, not only test signals.

### Architecture verification
- Passed for the changed slice: AP-010, AP-020, AP-025, AP-028, AP-046, AP-051, AP-054, AP-069, AP-074, AP-076.
- Dependency traceability: main.tsx renders App; App.tsx:5 injects the story into StoryPlayer. StoryPlayer.tsx passes story.experiment into ExperimentPanel; ExperimentPanel.tsx:17 invokes the injected run(config), and :58 displays the injected runLabel. experiment.ts:36 wires source/writer/publishers into runDigest; pipeline.ts:16/:20/:22 actually invokes collect/write/publish.
- Runtime completeness: no alternate scene set or entrypoint added; only one active DIP story. Existing engine/story separation remains intact.
- Entry point wiring: production main.tsx → App → StoryPlayer → ExperimentPanel → runExperiment → runDigest → in-memory adapters. The public browser test traverses this path and inspects the generated document contents.
- Anti-gaming: no pipeline behavior, validation, approval gate or timers removed. Fixed teaching text is expressly labelled as fixed data; the simulation is not represented as an external AI or publishing integration. The two run-label tests assert compatibility and invocation with the chosen configuration; pipeline/browser tests inspect actual output documents and denial.
- Non-applicable: DB/auth/migration/backend rules; no such components were added. AP-075 is not a new architecture migration here; the existing walking skeleton and public E2E remain exercised.
- Residual risk: author review only, unchanged known P3 graph declaration size, no external-service acceptance or second full lesson.
- VERDICT: PASS for author review of this slice only.

### Fixed finding
- [P2] Evidence: graphs.ts previously described the website as implementing Publisher even in the direct-dependency scene, before Publisher existed. Impact: the inspector contradicted the central DIP transition. Rule: AP-076. Fix decision: fix-now; website.detail now distinguishes o.publisher and explicitly labels the final teaching implementation.

### Verification evidence
- 4 new copy tests failed before editing; 38 tests now pass, including 2 generic/configured experiment-label tests. Production TypeScript/Vite build passes.
- Public Chrome traversed every scene at 1440px and 390px with no page/heading/body/action overflow; exercised inversion, runtime view and approved/denied generation.
- Public HTTP 200, factory title, and exact JS/CSS asset equality verified after deployment 83a83c75-470c-46f3-bb38-b929196f55aa.
- Evidence is retained under thread storage content-factory/; no credentials are included.
