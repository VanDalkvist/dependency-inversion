import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
  });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (media: string) => ({
      media,
      matches: media.includes("reduced-motion"),
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(cleanup);
describe("DIP film user journeys", () => {
  it("shows the lesson subject in the page heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Как не привязать помощника к одному сервису?" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Сценарий знает API всех сервисов",
      }),
    ).toBeTruthy();
  });
  it("shows rules on the card and reveals API details only in its inspector", () => {
    render(<App />);
    const card = screen.getByRole("button", {
      name: "Блок Сценарий выпуска. Подробнее",
    });
    expect(card.textContent).toContain("Отобрать материалы без дублей");
    expect(card.textContent).toContain("Зависимости кода");
    expect(card.textContent).not.toContain("choices[0].message");
    expect(card.textContent).not.toContain("parse_mode");
    fireEvent.click(card);
    const inspector = screen.getByRole("region", { name: "Инспектор блока" });
    expect(inspector.textContent).toContain("choices[0].message");
    expect(inspector.textContent).toContain("parse_mode");
  });
  it("keeps the late experiment outside the bounded lesson screen", () => {
    render(<App />);
    expect(document.querySelector(".lesson-screen")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 9:/ }));
    expect(document.querySelector(".lesson-screen .experiment")).toBeNull();
    expect(document.querySelector(".lesson-extras .experiment")).toBeTruthy();
  });
  it("opens supplementary lesson content without expanding the page", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Вывод и источники" }));
    const dialog = screen.getByRole("dialog", { name: "Вывод и источники" });
    expect(dialog.textContent).toContain(
      "Интеграции зависят от контрактов сценария",
    );
    expect(dialog.querySelectorAll("a").length).toBe(3);
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("lets readers switch between feedback and the original explanation", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 3:/ }));
    fireEvent.click(
      screen.getByRole("button", { name: "Да: есть отдельный интерфейс" }),
    );
    expect(
      (document.querySelector(".narration-body") as HTMLElement).hidden,
    ).toBe(true);
    fireEvent.click(
      screen.getByRole("button", { name: "Показать объяснение" }),
    );
    expect(
      (document.querySelector(".narration-body") as HTMLElement).hidden,
    ).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Показать ответ" }));
    expect(
      (document.querySelector(".narration-body") as HTMLElement).hidden,
    ).toBe(true);
  });
  it("renders the approved Vanya Arc / Aha! impulse identity", () => {
    render(<App />);
    const brand = screen.getByRole("link", {
      name: "Vanya Arc / Aha! — интерактивные истории",
    });
    expect(brand.getAttribute("href")).toBe("/");
    expect(brand.textContent).toContain("Vanya Arc");
    expect(brand.textContent).toContain("Aha!");
    expect(brand.querySelector("img.brand-symbol")?.getAttribute("src")).toContain("aha-impulse-mark");
    expect(brand.querySelector("img.brand-symbol")?.getAttribute("alt")).toBe("");
    expect(brand.closest("header")).toBeTruthy();
  });
  it("inverts contract ownership through the actual scene action", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 4:/ }));
    expect(
      document.querySelector('[data-node-id="publish-port"]')?.textContent,
    ).toContain("TelegramClient");
    fireEvent.click(
      screen.getByRole("button", {
        name: "Задать Publisher на стороне сценария",
      }),
    );
    await waitFor(() =>
      expect(
        document.querySelector('[data-node-id="publish-port"]')?.textContent,
      ).toContain("Publisher"),
    );
    expect(
      screen.getByText(/Теперь сценарий → Publisher ← Telegram/),
    ).toBeTruthy();
  });
  it("does not accept an incorrect explanation of inversion", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 3:/ }));
    fireEvent.click(
      screen.getByRole("button", { name: "Да: есть отдельный интерфейс" }),
    );
    expect(
      screen.getByText(/Отдельный интерфейс ещё не решает задачу/),
    ).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Следующая сцена",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("switches code dependency view to execution without changing the scene", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Порядок работы" }));
    expect(
      screen.getByRole("button", { name: "Блок Согласовать. Подробнее" }),
    ).toBeTruthy();
    expect(document.querySelector(".film")?.getAttribute("data-scene")).toBe(
      "first",
    );
  });
  it("runs selected integrations and renders actual artifacts", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 9:/ }));
    fireEvent.change(screen.getByLabelText("Каналы публикации"), {
      target: { value: "both" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Запустить выпуск" }));
    expect(screen.getByText(/Учебный выпуск готов/)).toBeTruthy();
    expect(screen.getByText(/<article><h1>/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Согласование выпуска"), {
      target: { value: "no" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Запустить выпуск" }));
    await waitFor(() =>
      expect(screen.getByText(/Выпуск не согласован/)).toBeTruthy(),
    );
    expect(screen.queryByText(/<article><h1>/)).toBeNull();
  });
  it("switches both system themes", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Включить тёмную тему" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(
      screen.getByRole("button", { name: "Включить светлую тему" }),
    );
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
