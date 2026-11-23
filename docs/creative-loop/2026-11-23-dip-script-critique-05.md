# Aha! · DIP screenplay critique / revision 05 · 2026-11-23

**Scope:** screenplay-only correction of [script v1](../storyboards/AGENT_PUBLISHER_SCRIPT_V1.md), superseded by [script v2](../storyboards/AGENT_PUBLISHER_SCRIPT_V2_DIP.md). Draft PR #1 unchanged as a Draft; no UI code changed, no tests or release triggered. This is a review/repair pass, not a completed code-implementation creative-loop run.

## Owner feedback (direct observation)

Owner rejects previous script: all it visibly teaches is “we needed Telegram → we made a website publisher → we published to a site”. The mechanism of **dependency inversion** remains invisible. This directly invalidates previous cycle's success hypothesis that replaying the same prompt with a different output destination proves DIP.

## Grounded technical re-check

Re-read **current** `src/stories/dip/scenes.ts` before revising:
- `growth`: content workflow contains Telegram format/API details; adding site changes workflow.
- `wrapper`: merely extracting Telegram into `TelegramClient` preserving `chatId/parse_mode` does **not** invert the dependency.
- `invert`: content workflow defines `Publisher` and `Draft`; Telegram implements that interface; Telegram-specific `chatId` and formatting stay in integration.
- `directions`: distinguishes **runtime calls** (agent workflow still calls publisher) from **source dependency edges** (adapters depend on workflow's contract).
- `sandbox`: no external service calls; lesson simulates with prepared data and constructs documents in-browser.

Two canonical articles:
- [Brett L. Schuchert, DIP in the Wild, Martin Fowler site](https://martinfowler.com/articles/dipInTheWild.html), 21 May 2013: low-level details depend on domain-relevant high-level abstractions. **DIP ≠ DI ≠ IoC**, and introducing any arbitrary interface is insufficient.
- [Robert C. Martin, A Little Architecture](https://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html), 4 January 2016: the direction that reverses is **source-code dependency**, not runtime message direction; high-level policy module can own interface used by low-level module.
- [Robert C. Martin, If Else Switch](https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html): choosing a concrete implementation is pushed to composition, not repeated in high-level policy.
- [Refactoring Guru, Adapter](https://refactoring.guru/ru/design-patterns/adapter): adapters solve incompatible interfaces; one adapter by itself is **not** proof that the higher-level policy owns its contract.

**Central fact / causal test:** hold *channel* and *API-breaking event* constant while observing **which source file must change**. This isolates DIP from simply swapping the destination.

## Why original screenplay failed

A/B in v1 compares:
- A: agent has Telegram tool, website missing → can't post on site.
- B: agent gets website tool → can post on site.

This result is perfectly possible with `if (channel === 'website') ...` embedded in `NewsAgentWorkflow`. It demonstrates **new capability**, perhaps DI or Adapter, and proves **nothing about who owns the interface**.

### Alternative conflict candidates challenged

| Hypothesis | What could be shown | Critic |
| --- | --- | --- |
| Need to post on a website | New integration | **VETO** as DIP proof; possible with ordinary `if` |
| Switch Telegram to another chat service | A provider swap | **VETO** for same reason |
| Rename the agent tool from “sendToTelegram” to “publish” | Generic label appears | **VETO**: renaming can hide the same Telegram-specific arguments |
| Show two complete architecture diagrams | Dependency arrows and contracts | **REWORK**: technically accurate but reintroduces first-screen overload |
| Show Telegram API change and repair location **before** and **after** | Same provider, same user command, different file edited | **ACCEPT**: observer can identify which code depends on details |
| Explicitly show interface contract owned by agent workflow | `Publisher.publish(Draft)` with implementations importing contract | **REQUIRED**, otherwise previous comparison proves only module isolation |
| Make AI auto-create its own adapters from chat | Instant “magic fix” | **VETO**: false tool semantics and source capabilities |
| End with an unseen website channel as prediction | Can learner infer adding website affects adapter alone? | **ACCEPT as transfer test**, not main climax |

### Critic of selected version

1. **Error recovery is not automatic.** With DIP, Telegram can still fail when its API changes. The difference is which module you fix and redeploy. v2 states this explicitly.
2. **Do not fake real Telegram changes.** The incident is a fictional simulation, not a claim about November 2026 Telegram updates.
3. **Do not conflate code ownership with runtime call direction.** After inversion the workflow still invokes a publishing tool; `TelegramAdapter`'s *source* imports the `Publisher` contract. The UI's labels must say “зависит код”, otherwise an upward arrow misteaches runtime order.
4. **Tool names alone are weak evidence.** The crucial element is the agent workflow defining its needs without `chatId`, Telegram formatting or `TelegramSDK` in the module. The actual integration can preserve these names internally.
5. **Storytelling must not turn into a programming slide deck.** Start with a successful conversation, introduce a genuine simulated problem, then zoom into the one affected portion of the agent. The artifact “три новости о космосе” remains the same.
6. **Choice is an action with consequence.** “Починить старым способом” visibly edits `agent-workflow.ts`; “Вынести правила Telegram” moves vendor details into `telegram-adapter.ts`; a replay shows the identical incident requiring one adapter change. If the later UI lacks visible code-edit ownership, the product hypothesis has not been implemented.
7. **Simplify but don't overpromise.** “Agent stays unchanged” refers to the application's high-level news workflow and its vendor-independent `Publisher` contract, not any model weights, runtime tool configuration or entire agent installation.

## Corrected film / production brief

[Script v2](../storyboards/AGENT_PUBLISHER_SCRIPT_V2_DIP.md) now has six scenes: (1) Anya chats with AI and the bulletin succeeds, (2) fictional Telegram format change causes failure, (3) direct integration forces editing news workflow, (4) **one-time refactor** relocates Telegram requirements to an adapter whose code depends on workflow-owned `Publisher`, (5) **identical failure replay** demonstrates adapter-only correction, (6) a website appears *only* as optional extension/transfer question.

This is the closest causal before/after representation of DIP within a novice editorial storytelling format. **It remains a concept, not observed user comprehension**.

## Next acceptance gate

A novice can succeed without naming DIP if, after scene 5, they say:
1. “The **same Telegram** caused the same issue.”
2. “Before, the agent workflow had to be edited.”
3. “After, only the Telegram-specific tool has to be edited because it follows the workflow's publishing rule.”

If instead the answer is “a new website publisher was added” or “the assistant got a new button”, **reject** the revision as a DIP film.

**Status:** V2 script COMMITTED and source-reviewed; product UI **UNCHANGED**, tests **NOT RUN** for this script-only revision, real-browser evidence **NOT RUN**, human comprehension **NOT RUN**, no release, no merge. Learning: “to explain DIP demonstrate **direction of ownership / dependency and blast radius of a low-level change** with all other inputs fixed”, limited to source-architecture concepts (not interchangeable with every type of adapter/DI story).
