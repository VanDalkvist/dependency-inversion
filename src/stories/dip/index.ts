import type { StoryDefinition } from "../../player/contracts";
import { scenes } from "./scenes";
import { experiment } from "./experiment";
export const dependencyInversionStory:StoryDefinition={
 id:"dependency-inversion",title:"От скрипта — к своей редакции.",subtitle:"Инверсия зависимостей на примере агентского пайплайна.",
 topic:"dependency inversion principle", viewLabels:{code:"Зависимости кода",runtime:"Выполнение"}, conclusion:{title:"Не «всё должно быть абстрактным».",body:"Сначала — конкретная задача. Затем — её контракт. А детали работают на этих условиях."},
 chapters:[{id:"direct",title:"Сделали в лоб"},{id:"inversion",title:"Перевернули зависимости"},{id:"proof",title:"Проверили в деле"}],
 scenes,experiment,
 sources:[{title:"Роберт Мартин: кто владеет интерфейсом",url:"https://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html"},{title:"DIP in the Wild",url:"https://martinfowler.com/articles/dipInTheWild.html"},{title:"Refactoring Guru — референс подачи, не копия",url:"https://refactoring.guru/design-patterns/adapter"}]
};
