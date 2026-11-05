import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Stage from "./Stage";
import type { StageNode } from "./contracts";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { writable: true, value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);
const base: StageNode = { id: "example", label: "Другой сценарий", subtitle: "Описание", x: 20, y: 20, kind: "policy", width: 255, height: 216 };
function show(node: StageNode) { render(<Stage view={{ nodes: [node], edges: [] }} selected={null} playing={false} onInspect={() => {}} />); }

describe("generic node content hierarchy", () => {
  it("renders the supplied explanatory body before its separate dependencies", () => {
    show({ ...base, body: ["Проверить лимит", "Потребовать подтверждение"], linesLabel: "Зависимости", lines: ["StoragePort"] });
    const body = screen.getByText("Проверить лимит");
    const heading = screen.getByText("Зависимости");
    const dependency = screen.getByText("StoragePort");
    expect(body.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(Number(body.getAttribute("y"))).toBeLessThan(Number(heading.getAttribute("y")));
    expect(Number(heading.getAttribute("y"))).toBeLessThan(Number(dependency.getAttribute("y")));
  });
  it("preserves the original baseline for legacy code-only nodes", () => {
    show({ ...base, lines: ["legacyCall()"] });
    expect(screen.getByText("legacyCall()").getAttribute("y")).toBe("77");
  });
  it("renders explanatory-only nodes without a dependency section", () => {
    show({ ...base, body: ["Проверить лимит"] });
    expect(screen.getByText("Проверить лимит")).toBeTruthy();
    expect(document.querySelector(".node-code")).toBeNull();
  });
});
