import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import StoryPlayer from "./StoryPlayer";
import type { StoryDefinition } from "./contracts";
beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
  });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (media: string) => ({
      media,
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const story: StoryDefinition = {
  id: "independent",
  title: "Не DIP",
  subtitle: "Другой принцип",
  chapters: [{ id: "first", title: "Другой сюжет" }],
  scenes: [
    {
      id: "one",
      chapter: "first",
      title: "Рабочий первый кадр",
      body: "Это независимая история.",
      caption: "Начало",
      duration: 1000,
      views: { code: { nodes: [], edges: [] } },
    },
    {
      id: "two",
      chapter: "first",
      title: "Второй кадр",
      body: "Новое содержимое.",
      caption: "Конец",
      duration: 1000,
      views: { code: { nodes: [], edges: [] } },
    },
  ],
};
describe("player walking skeleton", () => {
  it("resets session state when a different story is supplied", () => {
    const view = render(<StoryPlayer story={story} />);
    fireEvent.click(screen.getByRole("button", { name: "Посмотреть схему и код" }));
    fireEvent.click(screen.getByRole("button", { name: "Следующая сцена" }));
    view.rerender(
      <StoryPlayer
        story={{ ...story, id: "new", scenes: [story.scenes[0]] }}
      />,
    );
    expect(document.querySelector(".film")?.getAttribute("data-scene")).toBe(
      "one",
    );
  });
  it("renders an unrelated injected story, navigates and replays it", async () => {
    render(<StoryPlayer story={story} />);
    fireEvent.click(screen.getByRole("button", { name: "Посмотреть схему и код" }));
    expect(screen.getByRole("heading", { name: "Не DIP" })).toBeTruthy();
    expect(screen.getByText("Это независимая история.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Следующая сцена" }));
    await waitFor(() =>
      expect(screen.getByText("Новое содержимое.")).toBeTruthy(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Начать сначала" }));
    await waitFor(() =>
      expect(screen.getByText("Это независимая история.")).toBeTruthy(),
    );
  });
});
