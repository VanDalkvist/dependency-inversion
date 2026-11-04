import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import App from "./App";
beforeEach(() => {
  const stored = new Map<string, string>();
  vi.stubGlobal("localStorage", { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { stored.set(key, value); } });
  Object.defineProperty(window, "matchMedia", { writable: true, value: (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);
function openShop() { return render(<MotionConfig reducedMotion="always"><App /></MotionConfig>); }
describe("real interactive experience", () => {
  it("lets a visitor replace the machine, invert the dependency, and actually make coffee", async () => {
    openShop();
    fireEvent.click(screen.getByRole("button", { name: /Фильтр-машина/ }));
    expect((screen.getByRole("button", { name: "Приготовить кофе" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Новая машина. Старые инструкции.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Перевернуть зависимость" }));
    await waitFor(() => expect(screen.getByText("Договор")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Приготовить кофе" }));
    expect(screen.getByText("Приготовлено чашек: 1")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Просто чайник/ }));
    expect((screen.getByRole("button", { name: "Приготовить кофе" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Горячая вода — ещё не кофе.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Начать заново" }));
    expect(screen.getByText("Проверим на практике")).toBeTruthy();
  });
  it("gives different meaningful feedback for both quiz answers", () => {
    openShop();
    fireEvent.click(screen.getByRole("button", { name: /Особенности конкретного банка/ }));
    expect(screen.getByText(/Тогда смена банка/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Договор «принять оплату»/ }));
    expect(screen.getByText("Именно. Банки меняются. Смысл магазина — нет.")).toBeTruthy();
  });
  it("switches both design system themes", () => {
    openShop();
    fireEvent.click(screen.getByRole("button", { name: "Включить тёмную тему" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Включить светлую тему" }));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
