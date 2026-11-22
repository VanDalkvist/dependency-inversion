import { describe, expect, it } from "vitest";
import { createPlayback, playback } from "./playback";
import { fixture } from "../test/story-fixture";
describe("generic film playback", () => {
  it("resumes after a correct choice, without another Play", () => {
    const done = playback(fixture, { ...createPlayback(), index: 1, elapsed: 150 }, { type: "answer", id: "yes" });
    expect(done.playing).toBe(true);
    expect(done.answers.b).toBe("yes");
    expect(playback(fixture, done, { type: "tick", ms: 10000 }).index).toBe(2);
  });
  it("stays paused after an incorrect choice", () => {
    const wrong = playback(fixture, { ...createPlayback(), index: 1 }, { type: "answer", id: "no" });
    expect(wrong.playing).toBe(false);
    expect(wrong.answers.b).toBeUndefined();
  });
  it("restores prior playback only after closing an inspector", () => {
    const open = playback(fixture, { ...createPlayback(), playing: true }, { type: "inspect", id: "block" });
    expect(open.playing).toBe(false);
    expect(playback(fixture, open, { type: "inspect", id: null }).playing).toBe(true);
    const paused = playback(fixture, createPlayback(), { type: "inspect", id: "block" });
    expect(playback(fixture, paused, { type: "inspect", id: null }).playing).toBe(false);
  });
  it("rewinds interactive transformations when seeking back to a scene", () => {
    const s = playback(
      fixture,
      { ...createPlayback(), index: 2, answers: { b: "yes" } },
      { type: "seek", index: 1 },
    );
    expect(s.answers.b).toBeUndefined();
  });
  it("supports precise seek within a scene without resuming", () => {
    const s = playback(
      fixture,
      { ...createPlayback(), playing: true },
      { type: "seek", index: 1, elapsed: 450 },
    );
    expect(s.elapsed).toBe(450);
    expect(s.playing).toBe(false);
  });
  it("advances a different injected story by elapsed time", () => {
    let s = playback(fixture, createPlayback(), { type: "play" });
    s = playback(fixture, s, { type: "tick", ms: 1100 });
    expect(s.index).toBe(1);
  });
  it("pauses at an unresolved gate and cannot auto-advance", () => {
    let s = { ...createPlayback(), index: 1, playing: true };
    s = playback(fixture, s, { type: "tick", ms: 1500 });
    expect(s.index).toBe(1);
    expect(s.playing).toBe(false);
  });
  it("wrong answer does not clear the gate; correct one does", () => {
    let s = { ...createPlayback(), index: 1 };
    s = playback(fixture, s, { type: "answer", id: "no" });
    expect(s.answers.b).toBeUndefined();
    expect(s.feedback).toBe("Попробуй ещё");
    s = playback(fixture, s, { type: "answer", id: "yes" });
    expect(s.answers.b).toBe("yes");
  });
  it("seek clamps, resets time, and pauses", () => {
    const s = playback(
      fixture,
      { ...createPlayback(), playing: true, elapsed: 500 },
      { type: "seek", index: 99 },
    );
    expect(s.index).toBe(2);
    expect(s.elapsed).toBe(0);
    expect(s.playing).toBe(false);
  });
  it("does not auto-play past the end", () => {
    const s = playback(
      fixture,
      { ...createPlayback(), index: 2, playing: true },
      { type: "tick", ms: 2000 },
    );
    expect(s.index).toBe(2);
    expect(s.playing).toBe(false);
  });
  it("ignores stale ticks while paused", () => {
    expect(
      playback(fixture, createPlayback(), { type: "tick", ms: 2000 }).index,
    ).toBe(0);
  });
  it("rejects invalid playback deltas", () => {
    expect(
      playback(
        fixture,
        { ...createPlayback(), playing: true },
        { type: "tick", ms: NaN },
      ).elapsed,
    ).toBe(0);
  });
});
