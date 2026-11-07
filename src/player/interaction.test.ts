import { expect, it } from "vitest";
import { createPlayback, playback } from "./playback";
import { fixture } from "../test/story-fixture";
import { answerEvent, presentScene } from "./interaction";
it("preserves a choice and executes a command once outside the reducer", () => {
  let calls = 0;
  const story = {
    ...fixture,
    scenes: fixture.scenes.map((s) =>
      s.id === "b"
        ? {
            ...s,
            actions: [
              {
                id: "yes",
                label: "Run",
                correct: true,
                feedback: "done",
                perform: () => {
                  calls++;
                  return { count: 7 };
                },
              },
            ],
          }
        : s,
    ),
  };
  const state = { ...createPlayback(), index: 1 };
  const event = answerEvent(story.scenes[1], state, "yes");
  expect(calls).toBe(1);
  const next = playback(story, state, event);
  expect(calls).toBe(1);
  expect(next.results.b).toEqual({ count: 7 });
  expect(next.answers.b).toBe("yes");
  const rewound = playback(story, next, { type: "seek", index: 1 });
  expect(rewound.results.b).toBeUndefined();
});
it("shows wrong attempts and locks a gate again after an invalid replacement", () => {
  let s = { ...createPlayback(), index: 1 };
  s = playback(fixture, s, { type: "answer", id: "yes" });
  s = playback(fixture, s, { type: "answer", id: "no" });
  expect(s.attempt).toBe("no");
  expect(s.answers.b).toBeUndefined();
  expect(playback(fixture, s, { type: "next" }).index).toBe(1);
});
it("does not complete a failed command", () => {
  const scene = {
    ...fixture.scenes[1],
    actions: [
      {
        id: "yes",
        label: "Run",
        correct: true,
        feedback: "ok",
        perform: () => {
          throw Error("failed");
        },
      },
    ],
  };
  const story = { ...fixture, scenes: [fixture.scenes[0], scene] };
  const state = { ...createPlayback(), index: 1 };
  const s = playback(story, state, answerEvent(scene, state, "yes"));
  expect(s.answers.b).toBeUndefined();
  expect(s.feedback).toBe("failed");
});
it("projects a different view from actual selections without mutating the source scene", () => {
  const original = fixture.scenes[0];
  const scene = {
    ...original,
    project: (context: any) => ({ body: context.answers.source }),
  };
  expect(
    presentScene(scene, {
      ...createPlayback(),
      answers: { source: "aggregate" },
    }).body,
  ).toBe("aggregate");
  expect(original.body).toBe("Текст");
});
