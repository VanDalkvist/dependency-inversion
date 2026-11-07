import { expect, it } from "vitest";
import { dependencyInjectionStory as story } from "./index";
import { createPlayback } from "../../player/playback";
import { presentScene } from "../../player/interaction";
import { runInjectionExperiment, injectionExperiment } from "./experiment";
import { execute, configuration } from "./lesson-model";
it("has no approval scene, selector, or scenario rule in DI", () => {
  expect(story.scenes.some((s) => s.id === "approval")).toBe(false);
  expect(injectionExperiment.choices.map((c) => c.id)).toEqual([
    "source",
    "writer",
    "publisher",
  ]);
  const ctx = createPlayback();
  for (const scene of story.scenes) {
    const visible = presentScene(scene, ctx);
    expect(
      [
        visible.title,
        visible.body,
        visible.caption,
        ...Object.values(visible.views).flatMap((v) =>
          v.nodes.flatMap((n) => [n.label, ...(n.body ?? [])]),
        ),
      ].join(" "),
    ).not.toMatch(/соглас|запрет/i);
  }
  expect(configuration(ctx)).not.toHaveProperty("approval");
});
it("executes the chosen publishers without an approval input", () => {
  const result = runInjectionExperiment({
    source: "aggregate",
    writer: "local",
    publisher: "both",
  });
  expect(result.artifacts).toHaveLength(3);
  expect(result.artifacts[1].body).toMatch(/^<b>/);
  expect(result.artifacts[2].body).toMatch(/^<article>/);
});
it("keeps DI teaching materials and outputs focused on injection", () => {
  const result = execute(createPlayback());
  expect(JSON.stringify(result.draft)).not.toMatch(/соглас|запрет/i);
  expect(result.calls.map((c) => c.operation)).toEqual([
    "collect",
    "write",
    "publish",
  ]);
});
