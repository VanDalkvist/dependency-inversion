# Aha! · Creative pre-production loop 04 · AI agent + architectural aha-moment
**Date:** 2026-11-23 · **Stage:** research + ideation + selected script **only** · **Consumer:** `VanDalkvist/dependency-inversion`, Draft PR #1. This is a SCRIPT-ONLY research/screenplay commission, **not** a fully implemented `game-tools/world-creative-loop` production run. The public film, interface and tests are unchanged. Do not label `ACTIVE_CYCLE.json` complete for code we have not written.

## 0 · Direct owner observations and source playback

Owner feedback (2026-11-22): **storytelling itself improved** (“уже гораздо лучше”), but the agent should be **Aня speaking with a neural model**, and **ordinary people will not infer which part of architecture changed** when Telegram is replaced by a website. They need a scenario that reveals the architecture's change in text *and* visuals. This supersedes the prior “one editor switching publishing channels is a sufficient visual proof” hypothesis, without discarding character and event-first framing.

Reviewed **current source** before storming:
- `src/player/guided-copy.ts`: first DIP is “Аня отправила выпуск в Telegram”, growth = adding a website, invert = generic publishing rule, channel = website. The narrative simply says the process got easier; the viewer never sees two comparable runs of an *agent*.
- `src/player/FocusedVisual.tsx`: the paper and Telegram/website cards can visibly swap, but the agent's **tool vocabulary / contract** is absent. The visual shows **what platform changes**, not **what code stopped depending on that platform**.
- `src/stories/dip/scenes.ts`: truthful technical contract `Publisher.publish(Draft)` is defined by the content scenario. `growth` shows dependency on Telegram formatting, `invert` makes the Telegram integration implement `Publisher`, `channel` adds the website implementation, `directions` distinguishes runtime call direction from source-code dependency direction.
- `src/stories/di/assembly.ts` + `lesson-model.ts`: actual `telegramPublisher`, `websitePublisher`, `runFactory` are present and return **browser-generated documents**, not external publications. Do not imply an actual Telegram/site API call.
- `docs/creative-loop/MEMORY.md` and Cycles 02/03: abstract negative opening and 9-step guided quiz were both owner-rejected; script needs a person, disruption, action, visible result, realistic consequences, readable typography.
- `game-tools/skills/world-creative-loop/{SKILL,RESEARCH,CONTINUATION,STATIC_REVIEW,LEARN_AND_EXTRACT}.md`: memory-first, NMT/ideation, TRIZ/MDA, at least 8 substantive alternatives, adversarial critic and source-grounded handoff. This invocation is explicitly narrowed by the owner to **script writing/research**. Implementation, post-code review and actual product proof are therefore **NOT PERFORMED**. Do not produce a fabricated code-complete manifest.

## 1 · Research: how explanatory interactive scripts teach abstract systems

### Scenario dramaturgy, people and tension
- [Nielsen Norman Group — UX Stories Communicate Designs](https://www.nngroup.com/articles/ux-stories/): center what a person wanted, pain from the existing system, and value after its change, instead of inventorying screens.
- [Nielsen Norman Group — Two Tips for Better UX Storytelling](https://www.nngroup.com/articles/two-tips-better-ux-storytelling/): a plot arc with a meaningful obstacle keeps attention; the audience should see the goal, complication, change and resolution.
- [Nielsen Norman Group — Storyboards Help Visualize UX Ideas](https://www.nngroup.com/articles/storyboards-visualize-ideas/): specify a concrete scenario, visual, captions and how the scene changes. Render one connected user path before branching.
- Direct original [Sarycheva/Arkhipov — article dramaturgy](https://github.com/N1arko/redaktura-skills/blob/main/statya/references/dramaturgia.md): a visible protagonist; human conditions, price of failure, meaningful detail, actual resolution. [UX-copy](https://github.com/N1arko/redaktura-skills/blob/main/ux-copy/SKILL.md): microcopy derives from what happened before and what happens after the action; never generic “Next”. [redaktura — AI traces](https://github.com/N1arko/redaktura-skills/blob/main/redaktura/references/neirotekst.md): avoid rhythmic “не X, а Y” loops, false significance, trivia dressed as insight.

**Transfer:** Anya talks to her agent, not to a narrator explaining code; new website requirement interrupts a working process. Show exactly what the model cannot do with its present tools. The same literal request returns after the fix.

### Causal learning & contrast
- [Cathy Moore — 4-step scenario design](https://blog.cathy-moore.com/scenario-design-the-process/): meaningful decisions have realistic consequences; show them before lecturing or declaring the correct choice.
- [Cathy Moore — action mapping](https://blog.cathy-moore.com/action-mapping-workflow-at-a-glance/): design backward from the action an audience should be able to make/recognize rather than a list of concepts.
- [Rittle-Johnson, Star & Durkin — Compare and Explain](https://journals.sagepub.com/doi/10.1177/0963721420969365): hold the problem and terminology constant, highlight one changed feature and prompt the learner to explain what differs. The evidence concerns mathematical learning; **transfer to this film is a reasoned design hypothesis, not a proven Aha! experiment**.
- [Google — Technical Writing, Illustrating](https://developers.google.com/tech-writing/two/illustrations): orient first with the big picture, then reveal only a relevant detail, labels and arrows that communicate a relation.

**Transfer:** “Теперь этот же выпуск на сайт” is repeated *verbatim* before and after a one-time architecture refactor. Keep same paper, same Anya, same draft, same goal. Only the **agent-facing publishing tool contract** and the adapter behind it change. Show same instruction / opposite outcome and only then name the design principle.

### Technical truth boundary
- [Martin Fowler — DIP in the Wild](https://martinfowler.com/articles/dipInTheWild.html): high-level policy is expressed through abstractions the low-level code conforms to; inversion reverses **code** dependency, not the direction data flows during execution.
- [OpenAI — Function calling](https://developers.openai.com/api/docs/guides/function-calling): a model can request available tool calls; the application runs the relevant tool and returns its result. A chat message alone does not attach tools or deploy an integration.
- [Anthropic — tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview): same client-owned tool execution distinction; tool access is an orchestration concern.
- **Verified local source:** the current DIP shows concrete high-level `Publisher`; the separate DI lesson supplies the selected concrete implementation. They complement each other but must not be misrepresented as synonyms.

**Transfer:** a software change is necessary **once** to create `publish(Draft)` and website adapter. Afterward Anya can select an already-implemented channel without altering the content-preparation scenario. A hypothetical email channel would need an email adapter. No “AI automatically rewired its own API from one chat prompt” claim.

## 2 · NMT — narrative job

**Audience:** curious AI-agent user who recognizes a chat box and a Telegram message, and lacks familiarity with interfaces, implementation/adapters, DIP or DI.

**Situation:** sees an interactive film about Aня's news agent; expected to learn through direct cause/effect without first understanding code.

**Job statement:** “When I tell my AI helper to send the same issue somewhere else, I want to **see which capability is missing and what is changed once**, so I can explain to a friend why adding the next destination won't require redoing the entire assistant.”

**Alternatives:** a technical diagram (clear only to programmers); a screencast (passive); written article (may require remembering different states); a superficial platform switcher (looks correct but teaches only destination selection).

**Positive RAT:** after a single interaction, nontechnical observer correctly says “the issue and the agent's task stayed the same, the way of handing the issue to the destination changed; each platform has its own helper.” Unprompted comprehension test is NOT RUN.

## 3 · TRIZ/MDA brainstorm — 12 divergent mechanisms

| # | Candidate | Mechanical viewer action → feedback/consequence | Adversarial critic |
| -- | -- | -- | -- |
| 1 | **Agent dialogue A/B**, identical text before/after | Press resend; same text receives inability then successful tool dispatch | **ACCEPT CORE**: best contrast; must show *why* second works |
| 2 | Personified animated Telegram and website arguing | Watch characters fight over a document | **VETO**: confusing anthropomorphism, unclear architecture |
| 3 | **Tools visible only at moment of failure** | Open “Почему?”; reveals Telegram-specific tool | **ACCEPT**: makes cause inspectable without full diagram |
| 4 | Split-screen two full architectures from second zero | Compare every node and arrow | **VETO**: repeats initial cognitive overload |
| 5 | **Physical news sheet** with the same exact title/text | Move the same draft to recipient after wiring change | **ACCEPT**: stable artifact makes changed boundary visible |
| 6 | Chatbot freely generates/executes own integration code | Type any message; model allegedly publishes from nothing | **VETO**: misleading tools/security and unimplemented LLM |
| 7 | One “universal connector” magically works with any API | Toggle website without creating adapter | **VETO**: technical falsehood — destination adapter still needed |
| 8 | **One action refactored visibly** (`Send to Telegram` → `Publish draft`) | Press rewire; tool name changes then two destinations appear | **ACCEPT**: direct architecture consequence; one-time code change must be explicit |
| 9 | Dump real before/after TypeScript to the hero stage | View source changes line by line | **REWORK**: keep precise code in optional expert details |
| 10 | **Third destination prediction** (hypothetical email) | Reader says what needs to be implemented, then checks reveal | **ACCEPT ENDING**: transfer test; label not implemented |
| 11 | Several quiz cards about contract/interface at each step | Pick one “correct” architecture jargon answer | **VETO**: returns old school-lesson UI owner rejected |
| 12 | **Switchable before/after replay**, one at a time | Toggle states and read changed/unchanged labels | **ACCEPT**: demonstrates inverse dependency through observable difference |

**TRIZ:** separate in time (conversation → one hidden tool → one new contract → same request replay), subtract nonessential controls, hold all but one variable fixed, move responsibility from the agent's high-level scenario into channel implementations. **MDA:** mechanics = user retries and rewires → dynamics = contrast surprise → aesthetics = “А, точно: агент по-прежнему делает выпуск, а инструменты могут быть разными”.

**Critic self-pass (not independent):**
- A funny comic may hide the actual technical point. Keep **one** semantic label: who knows about Telegram before, who knows after.
- The chat alone teaches that a capability is missing, not DIP. **The central architectural shot must stay.**
- The refactor cannot be magic: one-time developer code change is narrated, and new destinations need adapters.
- One-to-many fan-out is technically possible in current DIP but screen can first use one chosen channel; expansion to two only on the reveal.
- Current UI shows `story-paper` and platform cards, no tool-contract visualization. Merely renaming the existing boxes would repeat the complaint.
- A user “playing” a model that was not connected is an ethical/trust failure; scripted agent replies and browser simulation must be stated.

## 4 · Selected composition and actual draft

**Selected combined direction:** #1 + #3 + #5 + #8 + #12, with #10 as an end-of-story transfer question. One clear event drives all six frames. The script is **[AGENT_PUBLISHER_SCRIPT_V1.md](../storyboards/AGENT_PUBLISHER_SCRIPT_V1.md)**, containing:
1. Anya asks her AI helper for a bulletin; the news sheet appears.
2. She asks for the identical bulletin on a website; the helper lacks a website publishing tool.
3. Viewer opens the old tool, sees “send to Telegram” hardwired into the agent's work; adding site forces extra changes there.
4. One-time refactor to agent-owned “publish ready issue” and independent channel adapters.
5. **Verbatim replay** “Теперь этот же выпуск на сайт”, the new website handler receives the exact same paper.
6. Visitor toggles before/after and can choose Telegram vs website; a hypothetical email-channel request checks transfer.

**Accepted behavior ≠ existing implementation.** The current source can provide simulated publishing receipts but has neither an actual live LLM dialogue nor a reconfiguring agent-tool interface. Implementing the approved storyboard would require new scripted presentation and visual focus, plus checking whether the chat representation can reuse an existing Vanya UI component. It must not silently add a real LLM API call or an external publishing action.

## 5 · Pre-production review, limitations and next acceptance

**Static source check of the screenplay:**
- The technical fact was derived from actual `src/stories/dip/scenes.ts` rather than invented for drama.
- The same text/request appears twice; its exact identity is specified, not an animation promise.
- Source of side effects is explicit: tool runner executes available tool; a request to the model cannot add a website integration.
- No “free tool substitution” claim; the new channel adapter must be implemented.
- DIP explanation is not confused with DI: general rule and dependency direction in this film; handing a pre-built service into a system in the separate one.
- Existing authored script and public website remain unchanged pending owner reaction to this storyboard.

**Material risks (open):**
- Can a novice tell “changed software structure” from merely allowing a second tool? Need to show **before/after one agent-facing action**, not just a new icon.
- The agent's original name is currently “помощник” and its user-facing actor is not a functioning LLM; the new dialogue is fictional and the later UI must label it as a dramatization.
- Too much explanatory prose in frames 3–4 can erase the aha. Prefer one sentence + visual action, with code below the fold.
- No visual/mobile/browser testing, no human RAT or source execution in this **script-only** iteration; no production claim.
- Dialogue and art rights: the authored film-specific scenario is `LicenseRef-Aha-Film`. External research is only cited/linked, not reproduced.

**Best next artifact:** a clickable minimal **3-frame proof of cause** (failure → refactor → same request succeeds) with the screenplay's exact messages, showing which interface the agent uses. Validate with 3–5 people before replacing the current site.

## 6 · Honest loop status / learning / extraction

**Status:** RESEARCH+SCRIPT delivered, SOURCE REVIEW of proposed dramaturgy performed; **no source implementation, tests, browser proof or deployment**; not a full World Creative Loop `COMPLETE`. Previous `ACTIVE_CYCLE.json` remains the actual last completed code/release record. This is an intentional **owner-scoped pre-production** artifact, not a falsely complete game cycle.

**Learning:** prior implementation's central mistake was demonstrating which platform was selected but not showing which dependency the agent had to know. **Operational next-cycle rule:** if explaining architectural change, author a before/after with an identical input and a single observable changed boundary, then verify that a cold reader can name the boundary. Limit: a changed property may need two variables for correctness; don't overforce “one difference” at expense of truth.

**Tool-extraction verdict: REUSE** Cathy Moore scenario-design process, Sarycheva/Arkhipov editorial sources, NN/g storyboards, existing agent/movie runtime, Motion and Vanya UI. No new generic tool in game-tools justified by one script draft.
