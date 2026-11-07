import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import { runInjectionExperiment } from "./stories/di/experiment";
beforeEach(() => {
  history.replaceState(null, "", "/di/");
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
it("builds through clickable cards and carries selections into the sandbox", async () => {
 render(<App/>);
 fireEvent.click(screen.getByRole("button",{name:/Перейти к сцене 2:/}));
 fireEvent.click(screen.getByRole("button",{name:"Подключить Агрегатор"}));
 fireEvent.click(screen.getByRole("button",{name:/Перейти к сцене 3:/}));
 fireEvent.click(screen.getByRole("button",{name:"Подключить Локальный редактор"}));
 fireEvent.click(screen.getByRole("button",{name:/Перейти к сцене 4:/}));
 fireEvent.click(screen.getByRole("button",{name:"Подключить Сайт"}));
 fireEvent.click(screen.getByRole("button",{name:/Перейти к сцене 10:/}));
 expect((screen.getByLabelText("Источник материалов") as HTMLSelectElement).value).toBe("aggregate");
 expect((screen.getByLabelText("AI-редактор") as HTMLSelectElement).value).toBe("local");
 expect((screen.getByLabelText("Реализация Publisher") as HTMLSelectElement).value).toBe("website");
 fireEvent.change(screen.getByLabelText("Источник материалов"),{target:{value:"rss"}});
 await waitFor(()=>expect(screen.getByRole("button",{name:"Блок RSS-источник. Подробнее"})).toBeTruthy());
});
it("runs the configured factory and renders the actually captured Draft", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Перейти к сцене 10:/ }));
  fireEvent.change(screen.getByLabelText("Источник материалов"), {
    target: { value: "aggregate" },
  });
  fireEvent.change(screen.getByLabelText("AI-редактор"), {
    target: { value: "local" },
  });
  fireEvent.change(screen.getByLabelText("Реализация Publisher"), {
    target: { value: "probe" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Собрать и запустить" }));
  await waitFor(() =>
    expect(document.querySelectorAll(".artifacts pre")).toHaveLength(2),
  );
  const draft = JSON.parse(
    document.querySelectorAll(".artifacts pre")[1].textContent!,
  );
  expect(draft.materials).toHaveLength(3);
  expect(document.querySelector(".result-trace")!.textContent).toContain(
    "localWriter.write()",
  );
  expect(document.querySelector(".result-trace")!.textContent).toContain(
    "recordingPublisher.publish()",
  );
  fireEvent.change(screen.getByLabelText("Согласование выпуска"), {
    target: { value: "no" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Собрать и запустить" }));
  await waitFor(() =>
    expect(
      screen.getByText(/без согласования Publisher не вызван/),
    ).toBeTruthy(),
  );
  expect(document.querySelectorAll(".artifacts pre")).toHaveLength(1);
  expect(document.querySelector(".result-trace")!.textContent).not.toContain(
    ".publish()",
  );
});
it("records both actual publisher calls and rejects an invalid approval value", () => {
  const config = {
    source: "rss",
    writer: "cloud",
    publisher: "both",
    approval: "yes",
  };
  const r = runInjectionExperiment(config);
  expect(r.trace).toEqual([
    "rssSource.collect()",
    "cloudWriter.write()",
    "telegramPublisher.publish()",
    "websitePublisher.publish()",
  ]);
  expect(r.artifacts).toHaveLength(3);
  expect(r.artifacts[1].body).toMatch(/^<b>/);
  expect(r.artifacts[2].body).toMatch(/^<article>/);
  expect(() =>
    runInjectionExperiment({ ...config, approval: "maybe" }),
  ).toThrow("Неизвестное состояние");
});
