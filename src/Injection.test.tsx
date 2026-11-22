import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";
import { runInjectionExperiment } from "./stories/di/experiment";
beforeEach(() => {
  history.replaceState(null, "", "/di/");
  vi.stubGlobal("localStorage", { getItem: () => null, setItem() {} });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
});
it("keeps the mobile explanation visible and offers one obvious next action", async () => {
  render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  expect(document.querySelector(".film")?.getAttribute("data-pane")).toBe("text");
  fireEvent.click(screen.getByRole("button", { name: "Подключать инструменты снаружи" }));
  expect(document.querySelector(".film")?.getAttribute("data-pane")).toBe("text");
  const reveal = screen.getByRole("button", { name: /Посмотреть, что изменилось на схеме/ });
  expect(reveal).toBeTruthy();
  fireEvent.click(reveal);
  expect(document.querySelector(".film")?.getAttribute("data-pane")).toBe("graph");
  expect(screen.getByRole("button", { name: "Воспроизвести" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Текст/ }));
  fireEvent.click(screen.getByRole("button", { name: "Дальше сейчас" }));
  await waitFor(() =>
    expect(document.querySelector(".film")?.getAttribute("data-scene")).toBe("source"),
  );
  expect(document.querySelector(".film")?.getAttribute("data-pane")).toBe("text");
  const narration = document.querySelector(".narration") as HTMLElement;
  expect(within(narration).getByRole("button", { name: "Выбрать RSS" })).toBeTruthy();
});
it("does not advance underneath a deliberately opened explanation", () => {
  render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  fireEvent.click(screen.getByRole("button", { name: "Подключать инструменты снаружи" }));
  expect(screen.getByRole("button", { name: "Пауза" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Показать объяснение" }));
  expect(screen.getByRole("button", { name: "Воспроизвести" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Дальше сейчас" })).toBeTruthy();
});
it("builds through clickable cards and carries selections into the sandbox", async () => {
  render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 2:/ }));
  fireEvent.click(
    document.querySelector('[data-node-id="source-aggregate"] .node-select')!,
  );
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 3:/ }));
  fireEvent.click(
    document.querySelector('[data-node-id="writer-local"] .node-select')!,
  );
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 4:/ }));
  fireEvent.click(
    document.querySelector('[data-node-id="publisher-website"] .node-select')!,
  );
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 9:/ }));
  expect(
    (screen.getByLabelText("Источник материалов") as HTMLSelectElement).value,
  ).toBe("aggregate");
  expect(
    (screen.getByLabelText("AI-редактор") as HTMLSelectElement).value,
  ).toBe("local");
  expect(
    (screen.getByLabelText("Куда передать выпуск") as HTMLSelectElement).value,
  ).toBe("website");
  fireEvent.change(screen.getByLabelText("Источник материалов"), {
    target: { value: "rss" },
  });
  await waitFor(() =>
    expect(
      screen.getByRole("group", { name: "Карточка RSS-источник" }),
    ).toBeTruthy(),
  );
});
it("runs the configured factory and renders the actually captured Draft", async () => {
  render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 9:/ }));
  fireEvent.change(screen.getByLabelText("Источник материалов"), {
    target: { value: "aggregate" },
  });
  fireEvent.change(screen.getByLabelText("AI-редактор"), {
    target: { value: "local" },
  });
  fireEvent.change(screen.getByLabelText("Куда передать выпуск"), {
    target: { value: "probe" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Собрать и запустить" }));
  await waitFor(() =>
    expect(document.querySelectorAll(".artifacts pre")).toHaveLength(2),
  );
  const draft = JSON.parse(
    document.querySelectorAll(".artifacts pre")[1].textContent!,
  );
  expect(draft.materials).toHaveLength(3);
  expect(document.querySelector(".result-trace")!.textContent).toContain(
    "localWriter.write()",
  );
  expect(document.querySelector(".result-trace")!.textContent).toContain(
    "recordingPublisher.publish()",
  );
  expect(screen.queryByLabelText("Согласование выпуска")).toBeNull();
});
it("records both actual publisher calls without another condition", () => {
  const config = {
    source: "rss",
    writer: "cloud",
    publisher: "both",
  };
  const r = runInjectionExperiment(config);
  expect(r.trace).toEqual([
    "rssSource.collect()",
    "cloudWriter.write()",
    "telegramPublisher.publish()",
    "websitePublisher.publish()",
  ]);
  expect(r.artifacts).toHaveLength(3);
  expect(r.artifacts[1].body).toMatch(/^<b>/);
  expect(r.artifacts[2].body).toMatch(/^<article>/);
});
