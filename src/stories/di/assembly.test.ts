import { describe, expect, it } from "vitest";
import { assembleFactory } from "./assembly";
import { runDigest } from "../../content-factory/pipeline";
const brief = { topic: "Проверка DI", limit: 3 };
const base = { source: "rss", writer: "cloud", publisher: "telegram" };
describe("actual dependency injection", () => {
  it("selects implementations before running and calls the injected objects", () => {
    const a = assembleFactory({
      source: "aggregate",
      writer: "local",
      publisher: "website",
    });
    expect(a.calls).toEqual([]);
    const r = runDigest(brief, a.ports, true);
    expect(r.selected).toBe(3);
    expect(r.artifacts[0].body).toContain("<article>");
    expect(r.draft.intro).toContain("В этом выпуске");
    expect(a.calls.map((c) => `${c.operation}:${c.implementation}`)).toEqual([
      "collect:aggregateSource",
      "write:localWriter",
      "publish:websitePublisher",
    ]);
  });
  it("changing the supplied channel changes real output, not just a label", () => {
    const tg = runDigest(brief, assembleFactory(base).ports, true);
    const web = runDigest(
      brief,
      assembleFactory({ ...base, publisher: "website" }).ports,
      true,
    );
    expect(tg.artifacts[0].body).toMatch(/^<b>/);
    expect(web.artifacts[0].body).toMatch(/^<article>/);
    expect(web.draft.materials).toEqual(tg.draft.materials);
  });
  it("a recording Publisher receives the exact Draft prepared by the scenario", () => {
    const a = assembleFactory({ ...base, publisher: "probe" });
    const r = runDigest(brief, a.ports, true);
    expect(a.captured).toHaveLength(1);
    expect(a.captured[0]).toBe(r.draft);
    expect(JSON.parse(r.artifacts[0].body)).toEqual(r.draft);
    expect(a.calls.filter((c) => c.operation === "publish")).toHaveLength(1);
  });
  it("does not call even a configured Publisher without approval", () => {
    const a = assembleFactory({ ...base, publisher: "probe" });
    const r = runDigest(brief, a.ports, false);
    expect(r.artifacts).toEqual([]);
    expect(a.captured).toEqual([]);
    expect(a.calls.map((c) => c.operation)).toEqual(["collect", "write"]);
    expect(r.draft.materials).toHaveLength(2);
  });
  it("does not share mutable source records between factory runs", () => {
    const a = assembleFactory(base);
    const first = a.ports.source.collect(brief);
    const originalTitle = first[0].title;
    first[0].title = "Изменённый результат предыдущего запуска";
    const b = assembleFactory(base);
    expect(b.ports.source.collect(brief)[0].title).toBe(originalTitle);
  });
  it("isolates call histories and outputs between assembled factories", () => {
    const a = assembleFactory(base),
      b = assembleFactory(base);
    runDigest(brief, a.ports, true);
    expect(b.calls).toEqual([]);
    runDigest(brief, b.ports, false);
    expect(a.calls).toHaveLength(3);
    expect(b.calls).toHaveLength(2);
  });
  it.each([
    { ...base, source: "toString" },
    { ...base, writer: "missing" },
    { ...base, publisher: "__proto__" },
  ])("rejects an unknown implementation", (config) => {
    expect(() => assembleFactory(config)).toThrow("Неизвестная");
  });
});
