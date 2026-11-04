import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { usePlayback } from "./usePlayback";
import type { StoryDefinition } from "./contracts";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it("uses the real player interval and cancels it on pause, seek and unmount", () => {
  vi.useFakeTimers();
  const story: StoryDefinition = {
    id: "timer",
    title: "Timer fixture",
    subtitle: "",
    chapters: [{ id: "one", title: "" }],
    scenes: [0, 1].map((i) => ({
      id: String(i),
      chapter: "one",
      title: String(i),
      body: "",
      caption: "",
      duration: 1000,
      views: { code: { nodes: [], edges: [] } },
    })),
  };
  const { result, unmount } = renderHook(() => usePlayback(story));
  act(() => result.current.dispatch({ type: "play" }));
  act(() => {
    vi.advanceTimersByTime(1100);
  });
  expect(result.current.state.index).toBe(1);
  act(() => result.current.dispatch({ type: "pause" }));
  act(() => {
    vi.advanceTimersByTime(2000);
  });
  expect(result.current.state.elapsed).toBe(100);
  act(() => result.current.dispatch({ type: "seek", index: 0, elapsed: 450 }));
  expect(result.current.state.playing).toBe(false);
  expect(result.current.state.elapsed).toBe(450);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
