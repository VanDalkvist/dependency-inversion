import type { ExperimentDefinition, ExperimentResult } from "../../player/contracts";
import { runDigest } from "./pipeline";
import { aggregateSource,cloudWriter,localWriter,rssSource,telegramPublisher,websitePublisher } from "./adapters";
import type { Artifact, Publisher } from "./contracts";
export function runExperiment(config:Record<string,string>):ExperimentResult{
 const sources={rss:rssSource,aggregate:aggregateSource};
 const writers={cloud:cloudWriter,local:localWriter};
 if(!(config.source in sources)||!(config.writer in writers)||!["telegram","website","both"].includes(config.publisher)||!["yes","no"].includes(config.approval))throw new Error("Неизвестная конфигурация редакции");
 const outbox:Artifact[]=[];
 const publishers:Publisher[]=config.publisher==="both"?[telegramPublisher(outbox),websitePublisher(outbox)]:[config.publisher==="telegram"?telegramPublisher(outbox):websitePublisher(outbox)];
 const result=runDigest({topic:"Вайбкодинг без магии",limit:3},{source:sources[config.source as keyof typeof sources],writer:writers[config.writer as keyof typeof writers],publishers},config.approval==="yes");
 return {
  summary:result.approved?"Выпуск собран и записан в учебную ленту.":"Черновик готов. Без согласования выпуск не опубликован.",
  facts:[{label:"Получено материалов",value:String(result.received)},{label:"Уникальных материалов",value:String(result.selected)},{label:"Публикаций в ленте",value:String(outbox.length)}],
  artifacts:outbox,trace:[`Получено: ${result.received}`,`После удаления дублей: ${result.selected}`,"Черновик подготовлен",result.approved?`Артефактов создано: ${outbox.length}`:"Публикация остановлена: нет согласования"]
 };
}
export const experiment:ExperimentDefinition={
 title:"Твоя редакция. Твои детали.",
 description:"Это детерминированная симуляция: без вызовов моделей и настоящих публикаций. Меняй реализации — внутри исполняется один и тот же сценарий runDigest.",
 choices:[
  {id:"source",label:"Источник",options:[{id:"rss",label:"Одна RSS-лента"},{id:"aggregate",label:"Агрегатор источников"}]},
  {id:"writer",label:"Редактор",options:[{id:"cloud",label:"Облачная модель"},{id:"local",label:"Локальная модель"}]},
  {id:"publisher",label:"Публикация",options:[{id:"telegram",label:"Telegram"},{id:"website",label:"Сайт"},{id:"both",label:"Оба канала"}]},
  {id:"approval",label:"Согласование",options:[{id:"yes",label:"Разрешить выпуск"},{id:"no",label:"Оставить черновиком"}]}
 ],run:runExperiment
};
