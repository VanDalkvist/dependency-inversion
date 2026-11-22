import { describe, expect, it } from "vitest";
import { playChoice, isApprovedSameContent } from "./engine";
import { APPROVED_POST, REGENERATED_POST, episodeById, nextEpisode, episodes } from "./model";

describe("Фабрика Ани: четыре настоящих причины для архитектурных решений", () => {
  it("has an ordered season with four separate problems and outcomes", () => {
    expect(episodes.map(x=>x.id)).toEqual(["one-post","both-channels","rules","injection"]);
    expect(nextEpisode(episodeById("one-post"))?.id).toBe("both-channels");
    expect(nextEpisode(episodeById("injection"))).toBeUndefined();
  });
  it("first wrong branch really creates two different dates", () => {
    const r=playChoice("one-post","rewrite");
    expect(r.achieved).toBe(false);
    expect(r.receipts.map(x=>x.content)).toEqual([APPROVED_POST.text,REGENERATED_POST.text]);
    expect(isApprovedSameContent(r.receipts)).toBe(false);
  });
  it("first successful branch uses one approved draft in both real local publisher adapters", () => {
    const r=playChoice("one-post","reuse");
    expect(r.achieved).toBe(true);
    expect(r.receipts).toHaveLength(2);
    expect(isApprovedSameContent(r.receipts)).toBe(true);
    expect(r.receipts[0].artifact?.body).toContain("субботу в 12:00");
    expect(r.receipts[1].artifact?.body).toContain("<article><h1>");
    expect(r.receipts[1].artifact?.body).not.toContain("воскресенье");
  });
  it("manual publishing leaves one channel pending; composition calls both and returns receipts", () => {
    const manual=playChoice("both-channels","manual");
    const both=playChoice("both-channels","compose");
    expect(manual.receipts.map(x=>x.status)).toEqual(["готово","ожидает"]);
    expect(both.receipts.map(x=>x.status)).toEqual(["готово","готово"]);
    expect(isApprovedSameContent(both.receipts)).toBe(true);
    expect(both.proof).toContain("publishTelegram(post)");
  });
  it("DIP episode distinguishes site formatting fix inside core versus adapter, same draft and channel", () => {
    const before=playChoice("rules","patch-core"),after=playChoice("rules","own-rule");
    expect(before.changed).toBe("Сама фабрика · contentFactory");
    expect(after.changed).toContain("websitePublisher");
    expect(after.unchanged).toContain("Фабрика");
    expect(after.proof).toBe("Factory → Publisher ← WebsitePublisher");
    expect(before.receipts.map(x=>x.content)).toEqual(after.receipts.map(x=>x.content));
  });
  it("DI episode actually runs existing factory with a provided local writer and two publishers", () => {
    const before=playChoice("injection","rewrite-factory");
    const after=playChoice("injection","inject-local");
    expect(before.achieved).toBe(false);
    expect(after.achieved).toBe(true);
    expect(after.writer).toBe("localWriter");
    expect(after.proof).toContain("write:localWriter");
    expect(after.proof).toContain("publish:telegramPublisher");
    expect(after.proof).toContain("publish:websitePublisher");
    expect(after.receipts.map(x=>x.status)).toEqual(["готово","готово"]);
    expect(after.receipts[0].artifact?.body).toContain(after.draft?.title);
    expect(after.receipts[1].artifact?.body).toContain("<article>");
  });
});
