import { expect, it } from "vitest";
import { assembly, execution } from "./graphs";
it("separates selecting implementations from injecting them", () => {
  const selected = assembly({ selected: true });
  expect(selected.edges.map((e) => e.from)).toEqual([
    "assembler",
    "assembler",
    "assembler",
  ]);
  expect(selected.edges.some((e) => e.to === "scenario")).toBe(false);
  const injected = assembly({ selected: true, injected: true });
  expect(
    injected.edges.filter((e) => e.to === "scenario").map((e) => e.from),
  ).toEqual(["source", "writer", "publisher"]);
});
it("uses the opposite direction for runtime calls without implying reversed imports", () => {
  const runtime = execution();
  expect(runtime.flow).toBe(true);
  expect(runtime.edges.map((e) => [e.from, e.to])).toEqual([
    ["scenario", "source"],
    ["scenario", "writer"],
    ["scenario", "publisher"],
  ]);
});
it("preserves scenario rules while selected objects change", () => {
  const a = assembly({ selected: true, injected: true }),
    b = assembly({ selected: true, injected: true, probe: true });
  expect(a.nodes.find((n) => n.id === "scenario")!.body).toEqual(
    b.nodes.find((n) => n.id === "scenario")!.body,
  );
  expect(a.nodes.find((n) => n.id === "publisher")!.label).toBe("Telegram");
  expect(b.nodes.find((n) => n.id === "publisher")!.label).toBe("Проверочный");
  expect(
    assembly({ selected: true, injected: true, website: true }).nodes.find(
      (n) => n.id === "publisher",
    )!.label,
  ).toBe("Сайт");
});
