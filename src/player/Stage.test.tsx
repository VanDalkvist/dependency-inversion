import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Stage from "./Stage";
import type { StageNode } from "./contracts";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { writable: true, value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);
const base: StageNode = { id: "example", label: "Другой сценарий", subtitle: "Описание", x: 20, y: 20, kind: "policy", width: 255, height: 216 };
function show(node: StageNode) { render(<Stage view={{ nodes: [node], edges: [] }} selected={null} playing={false} onInspect={() => {}} />); }

describe("generic node content hierarchy", () => {
  it("activates an actionable card by click and keyboard instead of opening the inspector",()=>{
    const actions:string[]=[];let inspected=0;
    render(<Stage view={{nodes:[{...base,action:{id:"connect",label:"Подключить объект"}}],edges:[]}} selected={null} playing={false} onInspect={()=>{inspected++;}} onAction={id=>actions.push(id)}/>);
    const card=screen.getByRole("button",{name:"Подключить объект"});fireEvent.click(card);fireEvent.keyDown(card,{key:"Enter"});
    expect(actions).toEqual(["connect","connect"]);expect(inspected).toBe(0);
  });
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
