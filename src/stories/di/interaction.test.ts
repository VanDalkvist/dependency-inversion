import { expect, it } from "vitest";
import { createPlayback, playback } from "../../player/playback";
import { answerEvent, presentScene } from "../../player/interaction";
import { dependencyInjectionStory as story } from "./index";
function choose(
  state: ReturnType<typeof createPlayback>,
  index: number,
  id: string,
) {
  const s = playback(story, state, { type: "seek", index });
  return playback(
    story,
    s,
    answerEvent(presentScene(story.scenes[index], s), s, id),
  );
}
it("carries selected objects into an actual run and preserves scenario rules", () => {
  let s = createPlayback();
  s = choose(s, 1, "aggregate");
  s = choose(s, 2, "local");
  s = choose(s, 3, "website");
  s = choose(s, 4, "objects");
  s = choose(s, 5, "run");
  const r = s.results.run as any;
  expect(r.config).toMatchObject({
    source: "aggregate",
    writer: "local",
    publisher: "website",
  });
  expect(r.draft.materials).toHaveLength(3);
  expect(r.draft.intro).toContain("В этом выпуске");
  expect(r.artifacts[0].body).toMatch(/^<article>/);
  expect(r.calls.map((c: any) => c.implementation)).toEqual([
    "aggregateSource",
    "localWriter",
    "websitePublisher",
  ]);
});
it("changes the actual output after swapping and captures the passed Draft", () => {
  let s = createPlayback();
  s = choose(s, 3, "telegram");
  s = choose(s, 5, "run");
  expect((s.results.run as any).artifacts[0].body).toMatch(/^<b>/);
  s = choose(s, 6, "website");
  expect((s.results.swap as any).artifacts[0].body).toMatch(/^<article>/);
  s = choose(s, 7, "probe");
  expect((s.results.probe as any).captured).toHaveLength(1);
  expect(
    (s.results.probe as any).calls.filter(
      (c: any) => c.operation === "publish",
    ),
  ).toHaveLength(1);
});
