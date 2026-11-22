import type { Artifact, Draft, Publisher } from "../content-factory/contracts";
import { telegramPublisher, websitePublisher } from "../content-factory/adapters";
import { assembleFactory } from "../stories/di/assembly";
import { runFactory } from "../stories/di/pipeline";
import { APPROVED_POST, REGENERATED_POST, type ChoiceId, type EpisodeId } from "./model";

export type PublicationReceipt = { channel: "Telegram" | "Сайт"; status: "готово" | "ожидает" | "ошибка"; content: string; artifact?: Artifact };
export type EpisodeResult = {
  choice: ChoiceId;
  achieved: boolean;
  heading: string;
  explanation: string;
  changed: string;
  unchanged: string;
  receipts: PublicationReceipt[];
  writer?: string;
  proof?: string;
  draft?: Draft;
};
function draftFor(post: {title:string;text:string}): Draft {
  return { title: post.title, intro: post.text, materials: [] };
}
function publish(post: {title:string;text:string}, destinations: readonly ("telegram" | "website")[]): PublicationReceipt[] {
  const outbox: Artifact[] = [];
  const draft = draftFor(post);
  return destinations.map((id) => {
    const publisher: Publisher = id === "telegram" ? telegramPublisher(outbox) : websitePublisher(outbox);
    const artifact = publisher.publish(draft);
    return {
      channel: id === "telegram" ? "Telegram" : "Сайт",
      status: "готово", content: draft.intro, artifact,
    };
  });
}
export function playChoice(episode: EpisodeId, choice: ChoiceId): EpisodeResult {
  if (episode === "one-post") {
    if (choice === "rewrite") {
      return {
        choice, achieved: false, heading: "Тексты разошлись.",
        explanation: "Сайт снова получил текст от редактора: воскресенье вместо субботы. Этот путь оставляет два несогласованных объявления.",
        changed: "Текст на сайте", unchanged: "Утверждённый пост в Telegram",
        receipts: [ ...publish(APPROVED_POST, ["telegram"]), ...publish(REGENERATED_POST, ["website"])],
      };
    }
    if (choice === "reuse") {
      return {
        choice, achieved: true, heading: "Теперь везде одна дата.",
        explanation: "Написание поста — отдельный шаг. Telegram и сайт получили один утверждённый текст без повторной генерации.",
        changed: "Способ публикации", unchanged: "Утверждённый пост: суббота, 12:00",
        receipts: publish(APPROVED_POST, ["telegram","website"]),
      };
    }
  }
  if (episode === "both-channels") {
    if (choice === "manual") {
      return {
        choice, achieved: false, heading: "Выполнено только одно из двух.",
        explanation: "Первое действие сработало. Для сайта требуется отдельный запуск. Аня ещё не выполнила всё поручение.",
        changed: "Статус Telegram", unchanged: "Готовый пост",
        receipts: [...publish(APPROVED_POST,["telegram"]), {channel:"Сайт",status:"ожидает",content:APPROVED_POST.text}],
      };
    }
    if (choice === "compose") {
      return {
        choice, achieved: true, heading: "Оба канала получили один пост.",
        explanation: "Общее действие вызвало два отдельных публикатора и вернуло два результата. Повторно писать пост не пришлось.",
        changed: "Одна команда вместо двух", unchanged: "Утверждённый пост",
        receipts: publish(APPROVED_POST,["telegram","website"]),
        proof: "publishBoth(post) → publishTelegram(post) + publishWebsite(post)",
      };
    }
  }
  if (episode === "rules") {
    const correct = choice === "own-rule";
    if (correct || choice === "patch-core") {
      return {
        choice, achieved: correct,
        heading: correct ? "Фабрика осталась без HTML-зависимости." : "Сайт исправили. Но менять пришлось фабрику.",
        explanation: correct
          ? "Фабрика определяет правило publish(post). Публикатор сайта реализует его и знает HTML. При той же ошибке меняется только код сайта."
          : "Пока правила конкретного сайта лежат внутри фабрики, форматная правка затрагивает её основной сценарий.",
        changed: correct ? "Инструмент сайта · websitePublisher" : "Сама фабрика · contentFactory",
        unchanged: correct ? "Фабрика, пост и Telegram" : "Утверждённый пост",
        receipts: publish(APPROVED_POST,["telegram","website"]),
        proof: correct ? "Factory → Publisher ← WebsitePublisher" : "Factory → WebsiteFormatting",
      };
    }
  }
  if (episode === "injection") {
    if (choice === "rewrite-factory") {
      return {
        choice, achieved:false, heading:"Фабрику переписали ради одного редактора.",
        explanation:"Текст можно создать, но следующий отказ редактора снова приведёт к правкам в основном сценарии.",
        changed:"Код фабрики", unchanged:"Telegram и сайт",
        receipts:[{channel:"Telegram",status:"ожидает",content:""}, {channel:"Сайт",status:"ожидает",content:""}],
      };
    }
    if (choice === "inject-local") {
      const composed = assembleFactory({source:"rss",writer:"local",publisher:"both"});
      const result = runFactory({topic:"Фабрика контента: новый выпуск",limit:3},composed.ports);
      return {
        choice, achieved:true, heading:"Локальный редактор подготовил выпуск.",
        explanation:"Инструменты выбраны при сборке. Фабрика использовала переданный localWriter и два публикатора; её код не менялся.",
        changed:"Готовый редактор · localWriter", unchanged:"Фабрика и два канала публикации",
        receipts: [
          {channel:"Telegram",status:"готово",content:result.draft.intro,artifact:result.artifacts[0]},
          {channel:"Сайт",status:"готово",content:result.draft.intro,artifact:result.artifacts[1]},
        ],
        writer:composed.names.writer,proof:composed.calls.map(x=>`${x.operation}:${x.implementation}`).join(" → "),draft:result.draft,
      };
    }
  }
  throw new Error("Несовместимый выбор для эпизода: "+episode+"/"+choice);
}

export function isApprovedSameContent(receipts: PublicationReceipt[]) {
  return receipts.every(x => x.status==="готово" && x.content===receipts[0]?.content);
}
