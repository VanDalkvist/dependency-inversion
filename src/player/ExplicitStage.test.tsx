import React from "react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Stage from "./Stage";
import Inspector from "./Inspector";
import type { StageNode } from "./contracts";
beforeEach(() =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }),
  }),
);
afterEach(cleanup);
const node: StageNode = {
  id: "item",
  label: "Источник",
  subtitle: "Материалы",
  x: 20,
  y: 20,
  width: 230,
  height: 100,
  kind: "detail",
  code: { file: "source.ts", text: "collect()" },
  action: { id: "choose", label: "Выбрать источник" },
};
it("separates choosing from inspection and never turns the card into a popup target", () => {
  const actions: string[] = [];
  const inspected: string[] = [];
  render(
    <Stage
      view={{ explicitControls: true, nodes: [node], edges: [] }}
      selected={null}
      playing={false}
      onAction={(id) => actions.push(id)}
      onInspect={(id) => inspected.push(id)}
    />,
  );
  fireEvent.click(screen.getByRole("group", { name: "Карточка Источник" }));
  expect(inspected).toEqual([]);
  fireEvent.click(screen.getByRole("button", { name: "Выбрать источник" }));
  expect(actions).toEqual(["choose"]);
  expect(inspected).toEqual([]);
  fireEvent.click(
    screen.getByRole("button", { name: "Описание и код: Источник" }),
  );
  expect(document.activeElement).toBe(screen.getByRole("button", {name:"Описание и код: Источник"}));
  expect(inspected).toEqual(["item"]);
  expect(actions).toHaveLength(1);
});
it("keeps inactive cards read-only and explains the next available step", () => {
  render(
    <Stage
      view={{
        explicitControls: true,
        nodes: [{ ...node, action: undefined, hint: "Выбор на шаге 2" }],
        edges: [],
      }}
      selected={null}
      playing={false}
      onInspect={() => {
        throw Error("Unexpected popup");
      }}
    />,
  );
  fireEvent.click(screen.getByRole("group", { name: "Карточка Источник" }));
  expect(screen.queryByRole("button", { name: "Выбрать источник" })).toBeNull();
  expect(screen.getByText("Выбор на шаге 2")).toBeTruthy();
});
it("shows the received document as readable content without a code disclosure", () => {
  render(
    <Inspector
      node={{
        ...node,
        code: undefined,
        content: {
          title: "Полученный черновик",
          text: "Заголовок: Выпуск\nМатериалы: три статьи",
        },
      }}
      close={() => {}}
    />,
  );
  expect(
    screen.getByText(/Заголовок: Выпуск\s+Материалы: три статьи/),
  ).toBeTruthy();
  expect(document.querySelector("details")).toBeNull();
});
