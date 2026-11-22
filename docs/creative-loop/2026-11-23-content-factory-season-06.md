# Aha! · Creative Loop 06 — фабрика контента как сериал
**Дата:** 23.11.2026 · **Основание:** просьба автора разработать постепенный сериал о паттернах на примере фабрики контента; **scope:** четыре отдельных драматургических сценария, интернет-ревью после каждого до следующего, четыре интерактивных экрана, текущая ветка Draft PR #1, ручной Cloudflare-релиз.

## 0 · MEMORY REPLAY — перед идеями
**Реально перечитано:** `docs/creative-loop/MEMORY.md`, предыдущие Cycle 02–05 и v1/v2 отвергнутые сценарии, текущий код `App/GuidedExperience`, `src/content-factory`, `src/stories/di`, `game-tools/world-creative-loop/{SKILL,CONTINUATION,RESEARCH,STATIC_REVIEW,LEARN_AND_EXTRACT}.md`.

- **APPLY:** владельцу не подходит абстрактное отрицание в первой фразе и «история» без героя/события. Начало — Аня уже выпустила пост, а на сайте появился другой вариант.
- **APPLY:** пользовательские отзывы и регрессии показывали, что зелёные тесты не гарантируют понятного UI. Вводим отдельный human RAT и не выдаём jsdom за визуальную проверку.
- **SUPERSEDE:** доказательство DIP в виде «добавили новый сайт» отклонено самим автором. Серия 3 оставляет площадку прежней, меняет требования её форматирования и показывает, **чей код приходится трогать**.
- **APPLY:** сериал разворачивается внутри фабрики контента; новая «поломка Telegram API» отклонена как отдаление от предметной области.
- **SKIP:** новая айдентика и новые motion-библиотеки; используем утверждённый Aha! знак и реальную Vanya UI.

## 1 · NMT: от события к работе зрителя
**Ситуация:** читатель знает привычный чат с AI, просит написать пост, хочет разместить тот же пост в разных каналах, но считает устройство агентов загадочным.
**Действие, которому учим:** после возникновения новой проблемы угадать **какую именно часть процесса можно поменять, а какую оставить**. Не воспроизводить термин на экзамене.
**Проблема старого контента:** литература о DIP начинается слишком далеко от конкретного труда: коды, Telegram SDK, абстракции, тогда как Аня теряет контроль над утверждённым текстом.
**Реальная альтернатива:** короткий абзац, видео, разговор с AI; сериал должен оправдывать клики тем, что выбор меняет локальные результаты.
**RAT:** 3/5 людей без разработки сами различают (1) текст vs публикацию; (2) два receipt; (3) **владение правилами** в серии 3; (4) **передачу готового редактора** в серии 4. **NOT RUN**; пока наблюдал только авторские отзывы о предшественниках.

**TRIZ:** разъединяем ответственность, соединяем готовые действия, переносим площадочные требования за внешнюю границу, переносим выбор реализаций до запуска. Противоречие: серия должна оставаться простой, хотя следующий эпизод добавляет новый паттерн. Решение — **одна новая проблема на эпизод**, один устойчивый документ до появления нового редактора в финале.

**MDA:** механика — выбрать действие, увидеть контраст дат/статусов/модуля/редактора; динамика — Аня сталкивается с новой ценой старой схемы, меняет только один элемент; эстетика — узнавание «это же моя нейросеть, и вот почему она тратит работу дважды».

## 2 · 12 направлений и честный критик

| № | Направление | Предполагаемое действие и последствие | Решение критика |
|---|---|---|---|
| 1 | Один 30-шаговый фильм про SRP/DIP/DI | Долго читать термины до практики | **VETO**: исходное отторжение |
| 2 | **Четыре серии с одним героем и документом** | Ошибка → исправление → новая граница следующей серии | **ACCEPT**, центральная ось |
| 3 | Фильму нужна новая механика таймлайна | Play/пауза/переключатель инструмента | **VETO**: возвращает перегруз |
| 4 | Две разные генерации текста как первый конфликт | Сравнить «суббота» и «воскресенье», выбрать согласованный пост | **ACCEPT** |
| 5 | Начать с определения SRP | Ответить на техническую викторину | **VETO**: нет событийной боли |
| 6 | Два публикатора соединяются в «оба» | Одна команда → два результата, восстановление после ошибки сайта | **ACCEPT** |
| 7 | Новую площадку можно добавить магическим сообщением нейросети | Самособирающиеся API-ключи/сервисы | **VETO**: ложь об инструментах |
| 8 | DIP объясняется только сменой площадки | «Сайт появился, значит инверсия» | **VETO**: прошлый явный отзыв автора |
| 9 | **DIP как одно HTML-требование в двух местах кода** | Исправляем фабрику vs сайт-инструмент | **ACCEPT**, одна изменённая граница |
| 10 | **DI как замена готового редактора перед запуском** | Облачный не работает, подключили локальный — trace это подтверждает | **ACCEPT** |
| 11 | Обзор всех 50 паттернов через вселенную из иконок | Зритель ищет, где нажать | **VETO**: лишняя сложность |
| 12 | Большой «денежный станок» из Бабло с частицами | Красиво, но не объясняет ответственность | **REWORK**: оставить функциональный Motion |

**Критика:** single-agent adversarial pass, **не независимый агент**. Четыре отдельных урока — **один связанный сезон**, а не четыре необязательных эффекта. Важно, что каждый эпизод требует различной наблюдаемой причины отказа и действия пользователя.

## 3 · Строго последовательный сценарный / внешний research loop

Перед написанием следующего сценария завершал web-review предыдущего:

1. [Серия 1](../series/season-01/01-one-post.md) — scripted before research; затем [Cathy Moore: real consequences](https://blog.cathy-moore.com/scenario-mistakes-to-avoid-1-eager-feedback/), [Robert Martin SRP](https://www.oreilly.com/library/view/97-things-every/9780596809515/ch76.html), [Fowler: editing/publishing](https://martinfowler.com/bliki/EditingPublishingSeparation.html). Поправка: **обе** ветки показывают последствия; разное время объясняется повторной генерацией, а не гарантированной «памятью» LLM; два разных повода изменения.
2. [Серия 2](../series/season-01/02-both-channels.md) — новый сценарий **после ревью 1**, затем [Cathy Moore: learn from mistakes](https://blog.cathy-moore.com/3-ways-to-help-people-learn-from-mistakes-in-branching-scenarios/), [Vanderbilt interactive branching](https://www.vanderbilt.edu/cdr/module1/branching-out-with-interactive-scenarios/), [Fowler: composition caveat](https://martinfowler.com/bliki/AggregationAndComposition.html). Поправка: композиция действий ≠ обязательный GoF Composite, **ошибка сайта не отменяет Telegram** и нужен управляемый retry.
3. [Серия 3](../series/season-01/03-who-sets-rules.md) — после ревью 2; затем [DIP in the Wild](https://martinfowler.com/articles/dipInTheWild.html), [Robert Martin: A Little Architecture](https://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html). Поправка: недостаточно вынести HTML в файл, **фабрика владеет интерфейсом**. Реальный исходный контракт `src/content-factory/contracts.ts` подтверждён.
4. [Серия 4](../series/season-01/04-swap-writer.md) — после ревью 3; затем [Fowler: Dependency Injection](https://martinfowler.com/articles/injection.html), [Seemann: Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/), [Cathy Moore: action before explanation](https://blog.cathy-moore.com/scenario-mistakes-to-avoid-1-eager-feedback/). Поправка: новый редактор **предустановлен** и передаётся при сборке, не создаётся моделью из промпта; настоящий локальный след `write:localWriter` доказывает действие.

Все четыре документа содержат **собственные web-review секции с ссылками и ограничениями**. [Сценарная библия](../series/season-01/SEASON_BIBLE.md) объединяет сезон и критерии истинности.

## 4 · Реальные исходники, не картинки

- `src/series/model.ts` — типизированные сценарии, герой, одна проблема/пара вариантов/последствие на серию. Копирайт на отдельные авторские строки в REUSE.
- `src/series/engine.ts` — `playChoice` вызывает реальные локальные `telegramPublisher`, `websitePublisher`, `assembleFactory`, `runFactory`; `simulateWebsiteFailure` и `retryOnlyWebsite` реализуют частичный результат без повторной публикации в Telegram. Ни одного внешнего сетевого запроса или реального API-ключа.
- `src/series/SeasonApp.tsx` — один ввод/диалог, Vanya UI `ActionButton/CraftCard/Tag/ThemeToggle/WorkflowStrip`, Motion, документация результата; выбор вызывает движок **только по клику**, не при перерисовке. Отдельный URL серии и браузер Back через popstate.
- `src/series/season.css` — предметная композиция, шрифты 17–20 px, один заголовок, мобильная колонка, reduced-motion. Не копирует исходный код UI-kit.
- `series/index.html`, `vite.config.ts`, `src/App.tsx` — **настоящий** многостраничный entrypoint `/series/`, старые `/` и `/di/` сохранены, ссылка на сезон добавлена в footer существующей истории.
- `src/series/{engine,SeasonApp}.test.*`, `package.json` — настоящие тесты типов, разветвлений, данных и UI-путей. Переносимый `test:ui` содержит также старые GuidedExperience regression tests.

## 5 · Адверсариальная source review после реализации, не formal S9

**Dependency trace:** `src/App.tsx` распознаёт /series/ → `SeasonApp` читает модель → `ActionButton.onClick` вызывает `playChoice` из engine → `content-factory/adapters` или `assembleFactory/runFactory` → `EpisodeResult.receipts` → `Stage` визуально отображает реальные локальные артефакты. Где path = `/di/`, вызывается существующий StoryPlayer и его бизнес-движок; нет второй активной фабрики на той же странице.

**Runtime/state:** серия в собственной точке входа, результаты хранятся в React state после клика. Не вызываются вновь при каждом render; история браузера восстанавливает идентификатор серии. Неиспользованные live токены, фоновая автоматизация и outbound сеть отсутствуют.

**Entrypoint:** статический HTML `series/index.html` зарегистрирован в `vite.config.ts` и его deployment/asset receipt — только после подтверждения Wrangler. Не путать source file с фактами работающего внешнего сайта.

**Implementation:** неверный путь — наблюдаемое расхождение дат/ожидающий сайт/модуль фабрики/переписывание процесса; верный путь — совпавший пост/два публикатора/контракт фабрики/реальный localWriter. Идентичность Telegram-receipt при сайте fail→retry проверяется ссылочным `toBe`, не только текстом. Только в DIP-эпизоде сравнение мест исправления показано **как учебная архитектурная модель**; текущий исходный `Publisher` уже реализует хорошую границу, а mock дефект вымышлен.

**Product cold-read proxy:** один вопрос, один выбор, конкретный документ и явное последствие. Кнопки не блокируются за ошибочный выбор; зритель может повторить без сброса. Серии доступны напрямую через URL query, и назад работает. Проблема: реальный eye-tracking/зрительское понимание отсутствуют и не могут быть заменены source review.

## 6 · Ошибки реального цикла и bounded repairs

Смотри [hаndoff](HANDOFF.md) за финальной build/version. На момент написания:
- **Ранний remote build** подтвердил UI pipeline source `inspect/check`, но тесты остановились 3/113: в учебной истории одна и та же дата встречается в двух видимых местах, независимые статусные сообщения корректно сосуществуют, один ассерт проверял другой регистр слова. Ремонт **тестовых селекторов** с точным смыслом; никаких тестов не удалено.
- **Следующий remote build**: 113/113 Vitest, TypeScript/Vite, лицензии и 15/15 UI-тестов PASS, Worker `ioc` опубликовал реальный `series/index.html`, version `0e3697ee-a64c-4eb3-bdf0-f3fadaddac1f`.
- **Последующий источник**: проверка кода обнаружила возможный повтор локальных публикаций при React-render (useMemo не гарантирует единственный вызов), и неясность при частичном сбое сайта. Исправлено до следующего релиза: действия вызывают локальный движок **только из настоящего onClick**; ошибка сайта и повтор выполняются отдельными событиями; Telegram receipt сохраняется, контролируется тестом.
- **Текущая финальная сборка**: фиксировать результат только после фактических Cloudflare logs, не объявлять PASS заранее.

## 7 · Учёба и tool scout

**Инсайт 1 (owner + source):** реальный конфликт фабрики — два несогласованных текста — лучше вводит разделение ответственности, чем абстрактная ошибка SDK. Limit: не все ситуации создают конфликт через AI-публикацию; текстовый генератор не обязан ошибаться при повторе.

**Инсайт 2 (test+source):** в обучающем UI две разные вещи могут честно содержать одинаковую строку («воскресенье») и два отдельных status; тест не должен искусственно требовать уникальность содержимого. Критерий теста — **смысл результата** (какое поле у какого документа, статус какого канала).

**Инсайт 3 (source+repair):** локальные адаптеры, даже без сети, не должны запускаться как побочный эффект render: в будущем их могут заменить реальными вызываемыми инструментами. Вызов должен принадлежать пользовательскому событию, retry — только упавшей ветке.

**Tool extraction:** **REUSE** реальную Vanya UI, Motion, существующий фабричный движок, game-tools creative loop и источники Cathy Moore/Sarycheva. Новый generic «story engine» преждевременен: второй независимый продукт-потребитель и human RAT не показаны. Все новые компоненты остаются только в `dependency-inversion`.

## 8 · Граница результата
**Уже в исходниках:** четыре сценария, web-review каждого до следующего, четыре UI-эпизода, реальный локальный движок, отдельный URL и тесты.
**Нельзя приписывать:** настоящую LLM/Telegram/сайт, browser visual QA, прохождение реальными зрителями, формальный Arch S9b, маркетинговый PMF.
**Acceptance:** автор открывает `/series/`, делает четыре решения и отмечает, что заметил различия четырёх причин, а не четыре «кнопки одного цвета». Пока нет наблюдаемой RAT — успех **не подтверждён зрителями**.

## Final release receipts · verified 2026-11-23

The final manual Cloudflare Workers Build `d3c373ca-7fc8-47b3-b358-625ad435bd5f` from exact source SHA `878a22feeb94eefc9efe11fb72d47c3f483e4c18` reported **23 Vitest files / 114/114 tests PASS**, `tsc -b && vite build` PASS with three HTML entrypoints (`/`, `/di/`, `/series/`), `npm run check:licensing` PASS, pinned genuine Vanya UI **inspect/check/verify PASS** with another **15/15 UI jsdom tests**, and Wrangler **"Success: Deploy command completed"** with Worker `ioc` version **`5f0d26b0-65ad-4a23-a79f-50f426758566`** on both `aha.vanya-arc.dev` and `ioc.vanya-arc.dev`. `/series/index.html` was present in assets. Source-only corrections after the earlier build included event-owned publisher effects and partial failure/retry, with exact Telegram receipt identity test.

**Post-build product/source critique:** source trace `App → SeasonApp onClick → playChoice → local Publisher or assembleFactory/runFactory → artifact receipts → Stage`. Two design choices were repaired: no side effects in React render; no whole-batch re-publication on partial site failure. Wrong branching outcomes remain meaningful rather than blocked quizzes. Distinct beginner Job in every episode; jargon appears after the result. Human/browser RAT and manual screenshots **NOT RUN**. Initial 110/113 was a test assertion error (ambiguous Sunday text, two legitimate status announcements and casing), repaired without skipping tests. Status **SOURCE+AUTOMATED BUILD/DEPLOY PASS**, **USER UNDERSTANDING UNVERIFIED**.

**Research verification:** direct current external sources corroborate consequence-first mini-scenarios rather than immediate telling feedback: [Cathy Moore](https://blog.cathy-moore.com/scenario-mistakes-to-avoid-1-eager-feedback/) and [scenario design process](https://blog.cathy-moore.com/scenario-design-the-process/); gradual disclosure by [NN/g](https://www.nngroup.com/articles/progressive-disclosure/); substantive differentiation of DIP/DI by [DIP in the Wild](https://martinfowler.com/articles/dipInTheWild.html) and [Martin Fowler's DI](https://martinfowler.com/articles/injection.html). A short story with two choices needn't pretend to be a complex branching game; visible consequences are the test. No third-party text copied beyond brief descriptions.

**Tool extraction:** REUSE existing `game-tools`, Vanya UI, Motion and concrete factory ports. No generic season engine extracted without evidence of a second use.
