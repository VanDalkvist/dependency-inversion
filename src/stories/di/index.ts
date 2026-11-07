import type { StoryDefinition } from "../../player/contracts";
export const dependencyInjectionStory: StoryDefinition = {
 id: "dependency-injection", title: "Внедрение зависимостей",
 subtitle: "Продолжение фабрики контента: кто выбирает сервисы и как сценарий получает готовые зависимости.",
 chapters: [{ id: "assembly", title: "Выбор сервисов" }],
 scenes: [{ id: "roles", chapter: "assembly", title: "Контракт Publisher не выбирает канал", body: "В песочнице первого урока сервисы уже передавались снаружи. Теперь разберём сборку этой фабрики.", caption: "DI передаёт сценарию конкретные реализации.", duration: 18000, views: { assembly: { nodes: [{id:"scenario",label:"Сценарий выпуска",subtitle:"Правила фабрики",kind:"policy",x:375,y:180,width:255,height:216,body:["Отобрать материалы без дублей","Подготовить черновик выпуска","Публиковать после согласования"]}],edges:[] } } }],
 viewLabels: { assembly: "Сборка" }
};
