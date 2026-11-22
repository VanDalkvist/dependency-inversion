import { expect, it } from "vitest";
import { createPlayback } from "../../player/playback";
import { lessonView } from "./graphs";
it("starts with one understandable helper, not the complete service catalogue", () => {
  const first = lessonView(createPlayback(), 0);
  expect(first.nodes.map((n) => n.id)).toEqual(["scenario"]);
  expect(first.nodes[0].label).toBe("Помощник для выпуска");
  expect(first.nodes[0].lines).toBeUndefined();
  expect(first.regions).toEqual([]);
});
it("progressively reveals only the services relevant to the current decision", () => {
  const ctx = createPlayback();
  const source = lessonView(ctx, 1);
  expect(source.nodes.some((n) => n.id === "source-rss")).toBe(true);
  expect(source.nodes.some((n) => n.id === "writer-cloud")).toBe(false);
  expect(source.nodes.some((n) => n.id === "publisher-telegram")).toBe(false);
  const writer = lessonView(ctx, 2);
  expect(writer.nodes.some((n) => n.id === "writer-cloud")).toBe(true);
  expect(writer.nodes.some((n) => n.id === "publisher-website")).toBe(false);
  expect(writer.nodes.filter((n) => n.action).map((n) => n.action!.id)).toEqual(["cloud", "local"]);
  const afterWrong = lessonView({ ...ctx, attempt: "inside" }, 0);
  expect(afterWrong.nodes.some((n) => n.id === "publisher-telegram")).toBe(true);
});
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
