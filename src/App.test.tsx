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
  it("inverts contract ownership through the actual scene action", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 4:/ }));
    expect(
      document.querySelector('[data-node-id="publish-port"]')?.textContent,
    ).toContain("TelegramClient");
    fireEvent.click(
      screen.getByRole("button", { name: "Поднять Publisher к сценарию" }),
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
      screen.getByRole("button", { name: "Да, интерфейс же появился" }),
    );
    expect(screen.getByText(/Не совсем. Сценарий/)).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Следующий кадр",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("switches code dependency view to execution without changing the scene", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Выполнение" }));
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
    fireEvent.change(screen.getByLabelText("Публикация"), {
      target: { value: "both" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Прогнать выпуск" }));
    expect(screen.getByText(/Выпуск собран и записан/)).toBeTruthy();
    expect(screen.getByText(/<article><h1>/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Согласование"), {
      target: { value: "no" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Прогнать выпуск" }));
    await waitFor(() =>
      expect(
        screen.getByText(/Без согласования выпуск не опубликован/),
      ).toBeTruthy(),
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
