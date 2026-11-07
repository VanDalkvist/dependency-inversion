import { expect, it } from "vitest";
import { createPlayback } from "../../player/playback";
import { lessonView } from "./graphs";
it("moves the actual chosen card from the catalog into its matching slot", () => {
  const ctx = createPlayback();
  const before = lessonView(ctx, 1);
  const after = lessonView({ ...ctx, answers: { source: "aggregate" } }, 1);
  expect(before.nodes.find((n) => n.id === "source-aggregate")!.x).toBe(850);
  expect(after.nodes.find((n) => n.id === "source-aggregate")!.x).toBe(390);
  expect(after.nodes.some((n) => n.id === "empty-source")).toBe(false);
});
it("keeps scenario rules fixed while selections change", () => {
  const ctx = createPlayback();
  expect(
    lessonView(ctx, 1).nodes.find((n) => n.id === "scenario")!.body,
  ).toEqual(
    lessonView(
      {
        ...ctx,
        answers: { source: "aggregate", writer: "local", channel: "website" },
      },
      4,
    ).nodes.find((n) => n.id === "scenario")!.body,
  );
});
it("renders explicit wrong-attempt consequences and keeps choices actionable", () => {
  const view = lessonView({ ...createPlayback(), attempt: "inside" }, 0);
  expect(view.nodes.some((n) => n.id === "bad-attempt")).toBe(true);
  expect(
    view.edges.some(
      (e) => e.from === "scenario" && e.to === "publisher-telegram",
    ),
  ).toBe(true);
  expect(
    lessonView(createPlayback(), 2)
      .nodes.filter((n) => n.action)
      .map((n) => n.action!.id),
  ).toEqual(["cloud", "local"]);
});
