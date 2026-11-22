import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  history.replaceState(null, "", "/di/");
  vi.stubGlobal("localStorage", { getItem: () => null, setItem() {} });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
  });
});
afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
});

it("starts with one readable job, one decision and no film toolbar", () => {
  render(<App />);
  const story = document.querySelector(".experience") as HTMLElement;
  expect(story).toBeTruthy();
  expect(story.getAttribute("data-scene")).toBe("root");
  expect(within(story).getByRole("heading", { level: 1, name: "Как менять инструменты у одного помощника?" })).toBeTruthy();
  expect(within(story).getByRole("heading", { level: 2, name: /Кто должен выбирать/ })).toBeTruthy();
  expect(within(story).getAllByRole("button", { name: /Я подключу инструменты|Пусть выбирает сам помощник/ })).toHaveLength(2);
  expect(document.querySelector(".stage-svg")).toBeNull();
  expect(document.querySelector(".transport")).toBeNull();
  expect(document.querySelector(".chapters")).toBeNull();
  expect(screen.queryByRole("button", { name: "Воспроизвести" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Скорость воспроизведения" })).toBeNull();
});

it("keeps wrong choices on screen and explains the consequence without jumping", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Пусть выбирает сам помощник" }));
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  expect(screen.getByRole("status").textContent).toContain("придётся изменять самого помощника");
  expect(screen.queryByRole("button", { name: "Посмотреть, что дальше" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Я подключу инструменты снаружи" }));
  expect(screen.getByRole("status").textContent).toContain("три независимых места");
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  expect(screen.getByRole("button", { name: "Посмотреть, что дальше" })).toBeTruthy();
});

it("advances only when the learner chooses Next, then shows a readable current slot", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Я подключу инструменты снаружи" }));
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  fireEvent.click(screen.getByRole("button", { name: "Посмотреть, что дальше" }));
  await screen.findByRole("heading", { level: 1, name: "Откуда брать новости?" });
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("source");
  expect(screen.getByRole("button", { name: "Из новостной ленты" })).toBeTruthy();
  expect(screen.getAllByText("Пока не выбран").length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button", { name: "Из новостной ленты" }));
  expect(await screen.findByText("Новостная лента")).toBeTruthy();
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("source");
  expect(screen.queryByRole("button", { name: "Воспроизвести" })).toBeNull();
});

it("makes the actual selected tool visible and swaps it while keeping other choices", async () => {
  render(<App />);
  const next = async (heading: string) => {
    fireEvent.click(screen.getByRole("button", { name: "Посмотреть, что дальше" }));
    await screen.findByRole("heading", { level: 1, name: heading });
  };
  fireEvent.click(screen.getByRole("button", { name: "Я подключу инструменты снаружи" }));
  await next("Откуда брать новости?");
  fireEvent.click(screen.getByRole("button", { name: "Из общей подборки" }));
  await next("Кто подготовит текст?");
  fireEvent.click(screen.getByRole("button", { name: "У меня на устройстве" }));
  await next("Куда отправить готовый выпуск?");
  fireEvent.click(screen.getByRole("button", { name: "На сайт" }));
  expect(await screen.findByText("Подборка новостей")).toBeTruthy();
  expect(await screen.findByText("Локальный AI")).toBeTruthy();
  expect(await screen.findByText("Сайт")).toBeTruthy();
  await next("Подключим всё к помощнику");
  fireEvent.click(screen.getByRole("button", { name: "Сами работающие инструменты" }));
  await next("Запустим наш первый выпуск");
  fireEvent.click(screen.getByRole("button", { name: "Собрать выпуск" }));
  expect(await screen.findByText("Выпуск собран")).toBeTruthy();
  expect(screen.getByText(/Из .* материалов выбрано/)).toBeTruthy();
  await next("А если публикацию нужно перенести?");
  fireEvent.click(screen.getByRole("button", { name: "Подключить Telegram" }));
  expect(await screen.findByText("Telegram")).toBeTruthy();
  expect(screen.getByText("Подборка новостей")).toBeTruthy();
  expect(screen.getByText("Локальный AI")).toBeTruthy();
});

it("DIP explains the difference with a changing simple diagram, not API-first copy", async () => {
  history.replaceState(null, "", "/");
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "Как не привязать помощника к одному сервису?" })).toBeTruthy();
  expect(screen.getByText("Команды Telegram")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Начать историю" }));
  await screen.findByRole("button", { name: "Добавить сайт" });
  fireEvent.click(screen.getByRole("button", { name: "Добавить сайт" }));
  expect(screen.getByText("Сайт")).toBeTruthy();
  expect(document.querySelector(".stage-svg")).toBeNull();
});

it("technical details are optional and still backed by the original interactive graph", () => {
  render(<App />);
  expect(document.querySelector(".stage-svg")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  expect(document.querySelector(".stage-svg")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Воспроизвести" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "← Вернуться к истории" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "← Вернуться к истории" }));
  expect(document.querySelector(".stage-svg")).toBeNull();
  expect(document.querySelector(".experience")).toBeTruthy();
});

it("shows the full wordmark and makes the optional experiment available only at the end", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: "Vanya Arc / Aha! — интерактивные истории" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Попробовать свои инструменты" })).toBeNull();
  expect(document.querySelector(".experience-practice")).toBeNull();
});

it("preserves the completed choice when opening and closing the technical view", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Я подключу инструменты снаружи" }));
  expect(screen.getByRole("button", { name: "Посмотреть, что дальше" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Исследовать схему и код" }));
  expect(document.querySelector(".film")?.getAttribute("data-scene")).toBe("root");
  fireEvent.click(screen.getByRole("button", { name: "← Вернуться к истории" }));
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  expect(screen.getByRole("button", { name: "Посмотреть, что дальше" })).toBeTruthy();
  expect(screen.getByRole("status").textContent).toContain("три независимых места");
});
