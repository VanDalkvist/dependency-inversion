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

## Scenario card review — 2026-11-05

### Findings
- [P3] Evidence: the policy node previously rendered only RSS/provider/Telegram protocol expressions in its body. Impact: readers saw implementation coupling without the scenario's responsibilities. Rule: AP-054. Fix decision: fix-now; primary rules and a separate dependency layer are now rendered, while API specifics remain inspectable.

### Semantic probes
- Dependency traceability: production App injects the story; StoryPlayer passes its StageView to Stage; Stage invokes NodeContent with each node; NodeContent reads body, linesLabel and lines and actually renders them. No lesson import was added to the generic player.
- Runtime completeness: there is one active Stage → NodeContent path, with backwards-compatible support for old code-only nodes. No alternate renderer or new pipeline was added.
- Entry point wiring: the public production browser displays the new node body through the existing main → App → StoryPlayer entrypoint and opens its real inspector.
- Anti-gaming: no pipeline calls, validation, approval logic or playback gates were removed. Tests verify primary/secondary rendering, legacy layout, generic body-only nodes, actual inspector behavior and stage-dependent coupling. Browser checks inspect SVG text bounds and actual generated documents.

### Architecture verification
- Passed for changed slice: AP-020, AP-028, AP-046, AP-051, AP-054, AP-068, AP-069, AP-074, AP-076.
- Compatibility: optional StageNode fields; legacy lines retain y=77. Story-owned details/labels are injected; renderer contains no factory/DIP terminology.
- Not applicable: database, authentication, backend side effects or migration rules. This is a presentation change, not a protocol migration or new subsystem.
- Residual risk: author review only; known P3 declaration size in graphs.ts; no external API acceptance implied.
- Design check: existing tokens/radii/animation preserved. Accent coverage remains low (visual estimate below 1%, not a measurement). Main body uses the existing sans family and stronger hierarchy than dependency metadata. Verdict: PASS for author design review.
- VERDICT: PASS for author source/product review only.

### Verification
- 44 tests and production build passed; public 1440px/390px browser checks cover every code-dependency scene and resolved states, API inspector, both themes and withheld publication.
- Deployment 52723fd9-a963-44de-93ef-4dee2944c022, deployed source 71f3d9a, exact public/local JS and CSS equality. Evidence in thread-storage scenario-card/.

## Viewport player — 2026-11-05

- Request: fit the main lesson on one screen, except the late-appearing final block.
- New layout: bounded lesson-screen with header/title/scene/transport/footer; final experiment is a sibling outside the frame. No body-level overflow hiding. Narrow layouts expose Schema/Text panels; full narrative, answers and optional material remain accessible.
- Supplemental material: native dialogs for inspector, insight and conclusion/sources. Focus explicitly returns to the invoking HTML/SVG control. Narrative feedback replaces, rather than stacks beneath, the original explanation; the reader can switch back.
- Controls: one bottom transport, including gated Next; the duplicate narrative Next control was removed without changing playback transitions.
- Verification: 49 tests PASS, production build PASS. Public browser checks covered 139 before/after/pane states at 1920×1080, 1440×900, 1366×768, 1280×720, 900×768, 390×844 and 375×667; no page scroll before the final scene, text clipping or offscreen transport.
- Native Escape/focus return, runtime view, fullscreen, SVG keyboard inspection, and two approved / zero denied publication documents verified publicly. Reset removes the extra block and returns the page to one viewport.
- Deployment: source e68f117, version d5e55b00-31ff-4ae7-a1c2-c0ca4d2f0385; public asset hashes match the production build.
- Evidence: /Users/vanya/.bb/thread-storage/thr_pq8ws4r4w8/viewport/. The long browser matrix was split into bounded batches after the host RPC deadline stopped the first public run; the four completed public batches are the acceptance evidence.
- Author review only; no independent reviewer was spawned. Extreme dimensions/zoom outside the listed matrix are not claimed as verified.

### Architecture verification for viewport slice
- Passed: AP-020, AP-028, AP-046, AP-051, AP-052, AP-053, AP-054, AP-068, AP-069, AP-074, AP-076.
- Semantic probes: App still injects the story; StoryPlayer renders its generic Stage/Narration/Experiment. Dialog actually invokes the browser top-layer API and restores the captured opener. Final experiment calls the unchanged runExperiment/runDigest path. One production renderer remains; no migrated parallel entrypoint or domain shortcut was added.
- [P2] Evidence: before the change, at 1366×768 the document was 1478px high and transport ended at y=1201. Impact: the core movie controls required page scrolling. Rule: AP-054. Fix decision: fix-now; viewport frame and browser bounds checks.
- [P2] Evidence: the first native-dialog version returned focus to body after Escape. Impact: keyboard users lost their place. Rule: AP-069. Fix decision: fix-now; capture/restore the connected opener with preventScroll, two RED tests then GREEN, verified in Chrome for HTML and SVG controls.
- API/model contracts, story timings and domain invariants are unchanged. New UI state is local to the player/narration; dialogs do not own playback or domain state.
- Native dialog API is emulated only in jsdom test setup; production/browser acceptance uses real dialogs and actual output documents.
- Design verdict: PASS for author review; existing warm palette, hairlines and micro-radii retained, accent coverage remains low (visual estimate, not measured). Responsive disclosures replace unsafe text shrinking or hidden content in the tested matrix.
- Residual risk: author-only review; geometry is verified only at the seven listed sizes, not arbitrary zoom/very short windows. Existing large stylesheet/graph-declaration P3 debt remains log-only.
- VERDICT: PASS for author source and product review of the validated slice.
