import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import App from "../App";

beforeEach(()=>{
  history.replaceState(null,"","/series/");
  vi.stubGlobal("localStorage",{getItem:()=>null,setItem(){}});
  Object.defineProperty(window,"matchMedia",{writable:true,value:()=>({matches:true,addEventListener(){},removeEventListener(){}})});
});
afterEach(()=>{cleanup();history.replaceState(null,"","/");});

it("starts the first actual episode on the /series/ URL without technical film controls",()=>{
  render(<App/>);
  expect(screen.getByRole("heading",{level:1,name:"Пост готов. Аня его одобрила."})).toBeTruthy();
  expect(screen.getByRole("button",{name:"Посмотреть публикацию на сайте"})).toBeTruthy();
  expect(screen.getByRole("progressbar",{name:"Прогресс сезона"}).getAttribute("aria-valuemax")).toBe("4");
  expect(document.querySelector(".stage-svg")).toBeNull();
  expect(document.querySelector(".transport")).toBeNull();
  expect(document.querySelector(".ui-workflow-strip")).toBeTruthy();
  expect(document.querySelector(".season-stage .season-post")).toBeTruthy();
  expect(screen.getByText("Вымышленная история. Все публикации и ответы агента — учебная симуляция.")).toBeTruthy();
});

it("episode 1 reveals a visible conflicting date, then resolves it with one approved document",async()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Посмотреть публикацию на сайте"}));
  expect(await screen.findByRole("heading",{level:1,name:"На сайте появилась другая дата."})).toBeTruthy();
  expect(screen.getByText(/воскресенье в 12:00/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Снова написать текст для сайта"}));
  expect(screen.getByRole("status").textContent).toContain("Тексты разошлись");
  expect(screen.queryByRole("button",{name:/Следующая серия/})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Взять готовый пост и только опубликовать"}));
  expect(screen.getByRole("status").textContent).toContain("везде одна дата");
  expect(await screen.findByText("Содержание совпадает: да")).toBeTruthy();
  expect(screen.getByRole("button",{name:"Следующая серия · 2"})).toBeTruthy();
});

it("episode 2 displays two receipts and makes partial failure recoverable without rewriting",async()=>{
  history.replaceState(null,"","/series/?episode=both-channels");
  render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Проверить, что получилось в двух каналах"}));
  await screen.findByRole("heading",{level:1,name:"Telegram получил пост. Сайт — ещё нет."});
  fireEvent.click(screen.getByRole("button",{name:"Отправлять в каждый канал отдельно"}));
  expect(screen.getByRole("status").textContent).toContain("только одно из двух");
  fireEvent.click(screen.getByRole("button",{name:"Собрать одну команду из двух публикаций"}));
  expect(screen.getByRole("status").textContent).toContain("Оба канала");
  fireEvent.click(screen.getByRole("button",{name:"Проверить, что будет при ошибке сайта"}));
  expect(screen.getByRole("status").textContent).toContain("не принимает пост");
  expect(document.querySelector('.season-receipt[data-status="ошибка"]')).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Повторить только публикацию на сайте"}));
  expect(screen.getByText(/Telegram не отправляли второй раз/)).toBeTruthy();
  expect(document.querySelector('.season-receipt[data-status="ошибка"]')).toBeNull();
});

it("episode 3 shows which module is edited, not just a new publishing destination",async()=>{
  history.replaceState(null,"","/series/?episode=rules");
  render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Увидеть, где пришлось менять программу"}));
  await screen.findByRole("heading",{level:1,name:"Раньше правили всю фабрику."});
  fireEvent.click(screen.getByRole("button",{name:"Исправлять HTML внутри фабрики"}));
  expect(screen.getByRole("status").textContent).toContain("менять пришлось фабрику");
  fireEvent.click(screen.getByRole("button",{name:"Пусть фабрика задаёт правило, а сайт ему следует"}));
  expect(screen.getByRole("status").textContent).toContain("Фабрика осталась");
  expect(screen.getByText("Правило принадлежит фабрике. Требования сайта живут в его инструменте.")).toBeTruthy();
  expect(document.querySelectorAll('.season-rule-card[data-changed="true"]')).toHaveLength(1);
});

it("episode 4 genuinely uses the local writer and returns two real browser artifacts",async()=>{
  history.replaceState(null,"","/series/?episode=injection");
  render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Посмотреть, какой шаг остановился"}));
  await screen.findByRole("heading",{level:1,name:"Нужно заменить один инструмент."});
  fireEvent.click(screen.getByRole("button",{name:"Подключить готовый локальный редактор"}));
  expect(screen.getByRole("status").textContent).toContain("Локальный редактор подготовил");
  expect(await screen.findByText("Локальный редактор")).toBeTruthy();
  expect(document.querySelectorAll('.season-receipt[data-status="готово"]')).toHaveLength(2);
  expect(screen.getByText(/В этом выпуске — выбор сервисов/)).toBeTruthy();
});

it("clicking next series progresses and keeps its own URL, while old lesson routes stay separate",async()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Посмотреть публикацию на сайте"}));
  await screen.findByRole("heading",{level:1,name:"На сайте появилась другая дата."});
  fireEvent.click(screen.getByRole("button",{name:"Взять готовый пост и только опубликовать"}));
  fireEvent.click(screen.getByRole("button",{name:"Следующая серия · 2"}));
  expect(await screen.findByRole("heading",{level:1,name:"Пост уже написан."})).toBeTruthy();
  expect(window.location.search).toBe("?episode=both-channels");
  expect(document.querySelector(".season")?.getAttribute("data-episode")).toBe("both-channels");
});

it("offers a keyboard-native disclosure for episode list without four competing menu options at entrance",()=>{
  render(<App/>);
  expect(screen.getByText("Все четыре серии").closest("details")?.open).toBe(false);
  expect(screen.getByRole("button",{name:"Сначала эту серию"})).toBeTruthy();
});
