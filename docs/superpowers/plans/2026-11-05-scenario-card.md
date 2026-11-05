# Scenario card Implementation Plan

> Execution: native inline, because this runtime disallows delegation without an explicit user request for agents.

**Goal:** Give the scenario block an understandable primary body, a separate dependency layer and API details in its inspector.
**Approved design:** Vanya explicitly requested this two-layer arrangement after seeing the proposed copy. Keep the title, rules, arrows, scene actions and existing visual language. No new pipeline behavior.
**Architecture:** Add optional generic body and linesLabel fields to StageNode; a small NodeContent renderer handles typography/layout without importing the DIP lesson. The story owns rules, per-boundary dependency labels and inspector explanations. Existing nodes without these fields retain their layout.
**Tech stack:** Existing React/TypeScript, SVG, Motion and Hearth & Wave tokens. No dependencies.

## Acceptance / review focus
- Three rules remain visible and unchanged through every code-dependency scene: select without duplicates, prepare a draft, publish after approval.
- Dependency labels reflect each boundary separately, including TelegramClient and the direct website stage; partial inversion must not hide RSS/model coupling.
- RSS item.description, model choices[0].message and Telegram chatId/parse_mode appear only in the relevant inspector, not in the visible card.
- The generic renderer supports existing code-only nodes and explanatory-only nodes without a blank dependency heading.
- The taller card stays inside its region; all SVG text fits the node at desktop and mobile scales. Keep its center at y=261 so dependency arrow anchors remain stable.

## Single bounded slice
- [ ] RED: generic Stage body/dependency ordering and legacy-node behavior; actual App journey from primary card to inspector; boundary-sensitive inspector/label behavior.
- [ ] Add StageNode.body?: string[] and linesLabel?: string. Create NodeContent.tsx; preserve legacy baseline y=77, use sans primary copy and quieter dependency labels.
- [ ] Update graphs.ts: 255×216 card at (45,153), fixed rules, stage-sensitive dependency labels and inspector details. Keep code fragments and edges.
- [ ] Run full tests and production build; inspect source-level boundaries (AP-020/046/051/074/076). Author review only.
- [ ] Chrome: initial / partial / full inversion, inspector, rewind, light/dark and 390px; verify text bounds and publication approval behavior.
- [ ] Commit/push, deploy prebuilt assets, verify public JS/CSS and browser, preserve parent workspace WIP and update the submodule pointer.

## Plan review
Scope is one vertical UI slice through story → injected generic node contract → rendered SVG → inspector. Existing end-to-end pipeline is retained. No new subsystem or protocol migration, no additional independent approval needed for the already approved layout. Prior P3 graph declaration size remains log-only.
