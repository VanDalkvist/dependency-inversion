import { describe, expect, it } from "vitest";
import { runExperiment } from "./experiment";
describe("in-memory content factory scenario", () => {
  it("rejects inherited object keys as configuration", () => {
    expect(() =>
      runExperiment({
        source: "toString",
        writer: "cloud",
        publisher: "telegram",
        approval: "yes",
      }),
    ).toThrow("Неизвестная конфигурация");
  });
  it("renders actual channel artifacts after approval", () => {
    const r = runExperiment({
      source: "rss",
      writer: "cloud",
      publisher: "telegram",
      approval: "yes",
    });
    expect(r.artifacts).toHaveLength(1);
    expect(r.artifacts[0].body).toContain("https://example.com/agents");
    expect(r.artifacts[0].body).toContain("Как собрать фабрику контента");
  });
  it("does not publish without approval", () => {
    const r = runExperiment({
      source: "rss",
      writer: "cloud",
      publisher: "both",
      approval: "no",
    });
    expect(r.artifacts).toEqual([]);
    expect(r.summary).toContain("публикации не созданы");
  });
  it("deduplicates before writing, whichever source is used", () => {
    const r = runExperiment({
      source: "aggregate",
      writer: "local",
      publisher: "both",
      approval: "yes",
    });
    expect(r.artifacts).toHaveLength(2);
    expect(
      r.facts.find((f) => f.label === "Материалов в выпуске")?.value,
    ).toBe("3");
    expect(r.artifacts[1].body).toContain("<article>");
  });
  it("keeps the same selected sources after changing writer", () => {
    const a = runExperiment({
      source: "rss",
      writer: "cloud",
      publisher: "telegram",
      approval: "yes",
    });
    const b = runExperiment({
      source: "rss",
      writer: "local",
      publisher: "telegram",
      approval: "yes",
    });
    expect(a.artifacts[0].body).toContain("https://example.com/agents");
    expect(b.artifacts[0].body).toContain("https://example.com/agents");
    expect(a.artifacts[0].body).not.toBe(b.artifacts[0].body);
  });
  it("rejects invalid integration choices explicitly", () => {
    expect(() =>
      runExperiment({
        source: "broken",
        writer: "cloud",
        publisher: "telegram",
        approval: "yes",
      }),
    ).toThrow("Неизвестная конфигурация");
  });
});
