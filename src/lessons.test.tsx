import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
beforeEach(() => {
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
it.each(["/di/", "/di"])("loads the DI continuation directly at %s", (path) => {
  history.replaceState(null, "", path);
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Как менять инструменты у одного помощника?" }),
  ).toBeTruthy();
  const link = screen.getByRole("link", {
    name: "DI — Внедрение зависимостей",
  });
  expect(link.getAttribute("href")).toBe("/di/");
  expect(link.getAttribute("aria-current")).toBe("page");
  expect(
    screen
      .getByRole("link", { name: "DIP — Инверсия зависимостей" })
      .getAttribute("href"),
  ).toBe("/");
});
it("keeps the original lesson and external new-tab link", () => {
  history.replaceState(null, "", "/");
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Как не привязать помощника к одному сервису?" }),
  ).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "Vanya Arc / Aha! — интерактивные истории" }).getAttribute("href"),
  ).toBe("/");
  expect(
    screen
      .getByRole("link", { name: "DIP — Инверсия зависимостей" })
      .getAttribute("aria-current"),
  ).toBe("page");
});
it("does not silently show DIP for an unknown lesson", () => {
  history.replaceState(null, "", "/missing");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Урок не найден" })).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "К первому уроку" }).getAttribute("href"),
  ).toBe("/");
});
