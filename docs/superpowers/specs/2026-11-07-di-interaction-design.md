# DI v2 — интерактивная сборка фабрики

Status: approved by user and implemented, 2026-11-07. Published revision verified by the author; user teaching acceptance remains open. Supersedes the product-acceptance claim for the first DI version, not its technical verification receipts.

## User correction

«Этот вариант не получился таким же наглядным и интерактивным. Нужно больше интерактива в стиле первого» (2026-11-07, BB thread thr_pq8ws4r4w8).

The published version (18327e1; Cloudflare fe56ce2c-454d-47be-bf26-d836f1dba05f) works technically but is not accepted for teaching quality. Its four gated scenes each offer one affirmative action. The five-card graph mostly adds edges or renames a card. The first lesson instead develops a visible problem, offers competing answers and changes graph ownership/topology. More text or more confirmation buttons would not address this correction.

## Approach

Recommendation: turn the existing film into a guided assembly exercise, preserving its look and one-screen player. A standalone free-form diagram editor would introduce a different interface; adding quizzes to the unchanged graph would leave the visual weakness intact. These are author assessments, not user-selected requirements.

## Proposed learner experience

- Keep the familiar scenario on the left and service implementations on the right. Show a distinct assembly area with MaterialSource, DraftWriter and Publisher slots. Business rules remain unchanged and visible.
- Choose a source, editor and channel. The selected service card visibly enters its matching assembly slot; a connection shows which object will be passed. Alternatives give different persistent assemblies, not the same generic resolved picture. Clicking is sufficient; dragging is not required.
- Contrast correct external wiring with an attempted choice inside the scenario. Show the consequence on the diagram, explain it briefly and allow retry; never claim that the existing first-lesson factory lacked DI.
- Launch the assembled factory. Highlight collect → write → publish against the chosen objects, show material/draft/output stages and an observable result derived from the shared executable factory. No invented receipt IDs or external calls.
- Substitute the site Publisher. The selected object and produced local document change; scenario rules stay fixed. This must be more visible than changing a caption or icon.
- Inject the recording Publisher, then withhold approval. Show captured Draft for the approved run and zero publish calls for the denied run. Let the learner predict/check the outcome and retry.

## Acceptance

Each substantive interaction changes a visible object position, binding, execution stage or result. Choices persist into the following steps and affect actual execution. Incorrect attempts remain understandable and recoverable. The final sandbox retains the same choices and agrees with the displayed assembly. Keyboard access and reduced motion retain all meaning. Preserve DIP, native DIP/DI header navigation, both themes, the viewport constraint and explicit local-only teaching data.

## Implementation boundary

Keep the shared factory and generic StoryPlayer. Express lesson-specific choices outside the player; add only the generic interaction contracts needed to represent distinct outcomes and persistent selections. No DI-specific conditionals in the player, no container or framework catalogue, no model/network integration. Author copy with statya, ux-copy and redaktura. Implementation/TDD planning follows approval of this revision.
