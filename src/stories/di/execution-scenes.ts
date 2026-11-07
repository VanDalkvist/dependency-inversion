import type { StoryScene } from "../../player/contracts";
import { action } from "./scene-actions";
import { execute } from "./lesson-model";
export const executionScenes: Omit<StoryScene, "views" | "project">[] = [
  {
    id: "run",
    chapter: "inject",
    title: "Запусти собранную фабрику",
    body: "Запусти выпуск с выбранными объектами. Справа появятся фактические материалы, черновик и документ. Нажми результат, чтобы открыть его содержимое.",
    caption: "collect → write → publish: наблюдаем вызовы переданных объектов.",
    duration: 24000,
    gate: true,
    actions: [
      action(
        "run",
        "Запустить мой выпуск",
        "Прогон выполнен. Карточки показывают его реальные результаты внутри страницы.",
        true,
        (context) => execute(context),
      ),
    ],
  },
  {
    id: "swap",
    chapter: "check",
    title: "Замени канал, сохрани сценарий",
    body: "Подключи другой Publisher. Новый объект займёт слот канала, а повторный запуск создаст документ в другом формате. Правила выпуска останутся прежними.",
    caption:
      "Меняется подключённый объект и документ; сценарий не переписывается.",
    duration: 22000,
    gate: true,
    actions: [
      action(
        "rewrite",
        "Переписать сценарий для нового канала",
        "Выбор канала снова попал бы в сценарий. Замени объект в сборке.",
        false,
      ),
      action(
        "telegram",
        "Заменить на Telegram",
        "Подключён Telegram. Новый документ доступен под сценарием.",
        true,
        (context) => execute(context),
      ),
      action(
        "website",
        "Заменить на сайт",
        "Подключён сайт. Новый HTML-документ доступен под сценарием.",
        true,
        (context) => execute(context),
      ),
    ],
  },
  {
    id: "probe",
    chapter: "check",
    title: "Проверь, что Publisher действительно вызван",
    body: "Сам тип Publisher ещё не доказывает вызов. Подключи реализацию, которая запоминает полученный Draft, и повтори прогон.",
    caption: "Проверочный объект сохраняет аргумент реального вызова publish.",
    duration: 22000,
    gate: true,
    actions: [
      action(
        "type",
        "Проверить только тип Publisher",
        "Тип описывает возможность вызова. Для проверки нужен записанный аргумент.",
        false,
      ),
      action(
        "probe",
        "Подключить запись вызова",
        "Проверочный Publisher получил Draft. Открой карточку результата, чтобы увидеть JSON.",
        true,
        (context) => execute(context, true, true),
      ),
    ],
  },
  {
    id: "approval",
    chapter: "check",
    title: "Проверь запуск без согласования",
    body: "Что произойдёт, если выпуск не согласован? Сравни два запуска. Для проверки запрета нужен результат без единого вызова publish.",
    caption:
      "Источник и редактор работают; несогласованный выпуск до Publisher не доходит.",
    duration: 22000,
    gate: true,
    actions: [
      action(
        "approve",
        "Согласовать и запустить",
        "В согласованном выпуске publish вызывается. Теперь проверь запуск без согласования.",
        false,
        (context) => execute(context, true, true),
      ),
      action(
        "deny",
        "Запустить без согласования",
        "У проверочного Publisher ноль вызовов. Материалы и черновик готовы, запись Draft пуста.",
        true,
        (context) => execute(context, false, true),
      ),
    ],
  },
  {
    id: "sandbox",
    chapter: "check",
    title: "Продолжи с собственной сборкой",
    body: "Песочница сохранила твой выбор. Меняй сервисы и согласование: схема сразу покажет новую сборку, а запуск — её вызовы и документы.",
    caption: "Здесь схема и настройки описывают одну и ту же сборку.",
    duration: 24000,
    experiment: true,
  },
];
