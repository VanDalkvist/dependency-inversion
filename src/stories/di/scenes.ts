import type {
  StoryScene,
  StoryContext,
  StoryAction,
} from "../../player/contracts";
import { lessonView } from "./graphs";
import { execute, configuration, observation } from "./lesson-model";
const action = (
  id: string,
  label: string,
  feedback: string,
  correct = true,
  perform?: StoryAction["perform"],
): StoryAction => ({ id, label, feedback, correct, perform });
const specs: Omit<StoryScene, "views" | "project">[] = [
  {
    id: "root",
    chapter: "choose",
    title: "Кто выбирает сервисы для выпуска?",
    body: "Контракты фабрики уже есть. Где выбрать RSS, редактора и канал? Попробуй оба варианта и посмотри, что происходит со сценарием.",
    caption: "Выбор должен получить отдельное место снаружи сценария.",
    duration: 18000,
    gate: true,
    actions: [
      action(
        "inside",
        "Выбирать сервисы внутри сценария",
        "Так сценарий сам выбирает Telegram. Чтобы сменить канал, придётся менять его код.",
        false,
      ),
      action(
        "outside",
        "Собрать зависимости снаружи",
        "Появились три слота сборки. Теперь выбери конкретные объекты для них.",
      ),
    ],
  },
  {
    id: "source",
    chapter: "choose",
    title: "Подключи источник материалов",
    body: "Нажми RSS или агрегатор. Выбранный объект займёт слот MaterialSource. Можно переключить выбор; он сохранится в следующих сценах.",
    caption:
      "Сборка выбирает объект источника. Сценарий получит его как source.",
    duration: 20000,
    gate: true,
    actions: [
      action(
        "rss",
        "Подключить RSS",
        "RSS занял слот source. Дальше будет использован именно этот источник.",
      ),
      action(
        "aggregate",
        "Подключить агрегатор",
        "Агрегатор занял слот source. Его материалы попадут в фактический запуск.",
      ),
    ],
  },
  {
    id: "writer",
    chapter: "choose",
    title: "Подключи AI-редактора",
    body: "Выбери облачного или локального редактора. Карточка переместится в слот DraftWriter. Уже выбранный источник останется на месте.",
    caption: "Источник и редактор подключаются независимо.",
    duration: 20000,
    gate: true,
    actions: [
      action(
        "cloud",
        "Подключить облачного редактора",
        "Выбран cloudWriter. В учебной версии он готовит заготовленный текст без запроса к модели.",
      ),
      action(
        "local",
        "Подключить локального редактора",
        "Выбран localWriter. После запуска увидишь его текст в Draft.",
      ),
    ],
  },
  {
    id: "channel",
    chapter: "choose",
    title: "Подключи канал публикации",
    body: "Выбери Telegram или сайт. Оба объекта принимают Draft через Publisher, но создают разные документы. Выбор повлияет на выпуск.",
    caption: "В слот publishers приходит выбранная реализация канала.",
    duration: 20000,
    gate: true,
    actions: [
      action(
        "telegram",
        "Подключить Telegram",
        "В сборку добавлен Telegram-публикатор.",
      ),
      action(
        "website",
        "Подключить сайт",
        "В сборку добавлен публикатор HTML-страницы.",
      ),
    ],
  },
  {
    id: "inject",
    chapter: "inject",
    title: "Передай сборку в сценарий",
    body: "В слотах находятся готовые объекты. Что передать в runDigest: названия сервисов или сами объекты с нужными методами?",
    caption: "Передача зависимостей параметрами — Dependency Injection.",
    duration: 20000,
    gate: true,
    actions: [
      action(
        "name",
        "Передать названия сервисов",
        "Строка с названием канала не умеет publish. Сценарию нужны готовые объекты.",
        false,
      ),
      action(
        "objects",
        "Передать готовые объекты",
        "Связи показывают, какие объекты переданы в ports. Сценарий по-прежнему использует свои контракты.",
      ),
    ],
  },
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
function project(
  scene: (typeof specs)[number],
  phase: number,
  context: StoryContext,
) {
  const view = lessonView(context, phase);
  const actions =
    scene.id === "swap"
      ? scene.actions?.filter(
          (a) =>
            a.id === "rewrite" ||
            a.id !== (context.answers.channel ?? "telegram"),
        )
      : scene.actions;
  const preset =
    phase > 1 &&
    phase < 9 &&
    (!context.answers.source ||
      (phase > 2 && !context.answers.writer) ||
      (phase > 3 && !context.answers.channel));
  return {
    views: {
      [observation(context) && phase >= 5 && phase < 9
        ? "runtime"
        : "assembly"]: view,
    },
    actions,
    body: preset
      ? `${scene.body} При прямом переходе недостающие сервисы взяты из учебного набора.`
      : scene.body,
    experimentDefaults: {
      ...configuration(context),
      ...(phase === 9 ? context.configuration : {}),
    },
  };
}
export const injectionScenes: StoryScene[] = specs.map((scene, phase) => ({
  ...scene,
  revealOnAction: true,
  views: { assembly: { nodes: [], edges: [] } },
  project: (context) => project(scene, phase, context),
}));
