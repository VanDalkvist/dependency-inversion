import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ExperimentPanel from "./ExperimentPanel";
import type { ExperimentDefinition } from "./contracts";

afterEach(cleanup);
const example = (): ExperimentDefinition => ({
  title: "Другой учебный пример",
  description: "Другая предметная область",
  choices: [{ id: "mode", label: "Режим", options: [{ id: "small", label: "Малый" }] }],
  run: vi.fn(() => ({ summary: "Пример выполнен", facts: [], trace: [], artifacts: [] })),
});

describe("application-owned experiment copy", () => {
  it("uses a neutral label for stories that do not configure a run label", () => {
    render(<ExperimentPanel experiment={example()} />);
    expect(screen.getByRole("button", { name: "Запустить пример" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /выпуск/ })).toBeNull();
  });
  it("uses the application's label and keeps passing the selected configuration", () => {
    const experiment = { ...example(), runLabel: "Проверить другой принцип" };
    render(<ExperimentPanel experiment={experiment} />);
    fireEvent.click(screen.getByRole("button", { name: experiment.runLabel }));
    expect(experiment.run).toHaveBeenCalledWith({ mode: "small" });
    expect(screen.getByRole("status").textContent).toContain("Пример выполнен");
  });
});
