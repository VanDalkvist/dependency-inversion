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

async function nextScene(label: string, nextHeading: string) {
  fireEvent.click(screen.getByRole("button", { name: label }));
  return screen.findByRole("heading", { level: 1, name: nextHeading });
}

it("opens with Anya doing something concrete, not an abstract negative question", () => {
  history.replaceState(null, "", "/");
  render(<App />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.textContent).toBe("Аня отправила выпуск в Telegram");
  expect(heading.textContent).not.toMatch(/^(Как|Почему|Зачем) не /);
  expect(screen.getByText(/К девяти утра помощник собрал новости/)).toBeTruthy();
  expect(screen.getByRole("button", { name: "Открыть новую задачу" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Воспроизвести|Пауза/ })).toBeNull();
  expect(document.querySelector(".stage-svg")).toBeNull();
});

it("uses real Vanya UI progress, buttons, cards, theme and no copycat graph on first contact", () => {
  render(<App />);
  expect(document.querySelector(".ui-workflow-strip.experience-progress")).toBeTruthy();
  expect(screen.getByRole("progressbar", { name: "Пройденная часть истории" }).getAttribute("aria-valuemax")).toBe("5");
  expect(document.querySelectorAll(".story-visual .story-paper").length).toBe(1);
  expect(document.querySelectorAll(".story-visual .ui-size").length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: "Выбирать канал перед запуском" }).className).toContain("ui-action-button");
  expect(screen.getByRole("button", { name: /Тема оформления:/ })).toBeTruthy();
  expect(document.querySelector(".chapters")).toBeNull();
  expect(document.querySelector(".transport")).toBeNull();
});

it("keeps the consequence on screen after wrong choice, without skipping the scene", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Встроить выбор канала в помощника" }));
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  expect(screen.getByRole("status").textContent).toContain("каждый новый канал");
  expect(screen.queryByRole("button", { name: "Выбрать первый канал" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Выбирать канал перед запуском" }));
  expect(screen.getByRole("status").textContent).toContain("Аня выбирает канал");
  expect(screen.getByRole("button", { name: "Выбрать первый канал" })).toBeTruthy();
});

it("reads five chosen chapters rather than nine technical quiz screens", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Выбирать канал перед запуском" }));
  await nextScene("Выбрать первый канал", "Первый выпуск отправим в Telegram");
  expect(document.querySelector(".experience")?.getAttribute("data-guided-step")).toBe("2");
  expect(screen.getByRole("button", { name: "В Telegram" })).toBeTruthy();
  expect(screen.queryByText(/AI-редактора DraftWriter/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "В Telegram" }));
  await nextScene("Собрать первый выпуск", "Помощник собирает первый выпуск");
  fireEvent.click(screen.getByRole("button", { name: "Собрать выпуск" }));
  expect(await screen.findByText("Выпуск собран")).toBeTruthy();
  await nextScene("Попробовать другую площадку", "Наутро Аня выбирает другой канал");
  fireEvent.click(screen.getByRole("button", { name: "Отправить выпуск на сайт" }));
  expect((await screen.findByText("Сайт")).textContent).toBe("Сайт");
  expect(screen.getByText(/Аня заменила только канал/)).toBeTruthy();
  await nextScene("Сравнить оба выпуска", "Теперь собери свой выпуск");
  expect(screen.getByRole("progressbar", { name: "Пройденная часть истории" }).getAttribute("aria-valuenow")).toBe("5");
  expect(screen.getByRole("button", { name: "Собрать другой выпуск" })).toBeTruthy();
});

it("DIP follows Anya's conflict and shows the effect of a shared publishing rule", async () => {
  history.replaceState(null, "", "/");
  render(<App />);
  await nextScene("Открыть новую задачу", "Редактор попросил выпуск для сайта");
  expect(screen.getByRole("progressbar", { name: "Пройденная часть истории" }).getAttribute("aria-valuemax")).toBe("6");
  fireEvent.click(screen.getByRole("button", { name: "Добавить публикацию на сайте" }));
  expect(screen.getByText(/пришлось менять работу самого помощника/)).toBeTruthy();
  await nextScene("Посмотреть решение Ани", "Аня оставила помощнику одну задачу");
  fireEvent.click(screen.getByRole("button", { name: "Принять и опубликовать готовый выпуск" }));
  expect(screen.getByText(/Telegram и сайт сами решают/)).toBeTruthy();
  await nextScene("Подключить сайт по новым правилам", "Сайт получил тот же выпуск");
  fireEvent.click(screen.getByRole("button", { name: "Опубликовать выпуск на сайте" }));
  expect(screen.getByText("Тот же выпуск готов к публикации")).toBeTruthy();
  await nextScene("Посмотреть, что сохранилось", "Помощник делает свою работу как прежде");
  expect(screen.getByRole("button", { name: "Каналы научились принимать один готовый выпуск" })).toBeTruthy();
});

it("back follows the authored journey instead of dropping into hidden technical scenes", async () => {
  history.replaceState(null, "", "/");
  render(<App />);
  await nextScene("Открыть новую задачу", "Редактор попросил выпуск для сайта");
  fireEvent.click(screen.getByRole("button", { name: "Добавить публикацию на сайте" }));
  await nextScene("Посмотреть решение Ани", "Аня оставила помощнику одну задачу");
  fireEvent.click(screen.getByRole("button", { name: /Назад/ }));
  await screen.findByRole("heading", { level: 1, name: "Редактор попросил выпуск для сайта" });
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("growth");
});

it("technical details remain optional; switching preserves the learner's completed choice", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Выбирать канал перед запуском" }));
  fireEvent.click(screen.getByRole("button", { name: "Посмотреть схему и код" }));
  expect(document.querySelector(".stage-svg")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "← Вернуться к истории" }));
  expect(document.querySelector(".experience")?.getAttribute("data-scene")).toBe("root");
  expect(screen.getByRole("button", { name: "Выбрать первый канал" })).toBeTruthy();
  expect(screen.getByRole("status").textContent).toContain("Аня выбирает канал");
});

it("no external publication is asserted in the story before the real simulated run", () => {
  render(<App />);
  const visual = document.querySelector(".story-visual") as HTMLElement;
  expect(visual).toBeTruthy();
  expect(within(visual).getByText("ДАЙДЖЕСТ АНИ")).toBeTruthy();
  expect(within(visual).queryByText("Текст получен из учебного запуска")).toBeNull();
  expect(screen.queryByRole("button", { name: "Собрать другой выпуск" })).toBeNull();
});
