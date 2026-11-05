import { describe, expect, it } from "vitest";
import { dependencyInversionStory as story } from "./index";
import { runExperiment } from "./experiment";

describe("content factory explanation",()=>{
  it("establishes the content factory and concrete workflow before introducing contracts",()=>{
    expect(story.subtitle).toContain("фабрики контента");
    expect(story.scenes[0].body).toContain("Фабрика контента");
    expect(story.scenes[0].body).toContain("согласования");
    expect(story.scenes[0].body).toContain("Telegram");
  });
  it("defines ownership, interface shape and the runtime limitation explicitly",()=>{
    const lift=story.scenes.find(s=>s.id==="invert")!;
    expect(lift.body).toContain("На стороне сценария определяем Publisher");
    expect(lift.insight).toContain("не только место");
    expect(story.scenes.find(s=>s.id==="directions")!.insight).toContain("внешний сервис недоступен");
  });
  it("labels fixed teaching data and output honestly",()=>{
    expect(story.experiment!.description).toContain("заготовленные");
    expect(story.experiment!.description).toContain("внутри этой страницы");
    const r=runExperiment({source:"aggregate",writer:"cloud",publisher:"both",approval:"yes"});
    expect(r.summary).toContain("Учебный выпуск");
    expect(r.artifacts).toHaveLength(2);
    expect(r.artifacts.every(a=>a.body.includes("Фабрика контента"))).toBe(true);
    expect(r.artifacts[0].body).toContain("Как собрать фабрику контента");
  });
  it("preserves the same source links and approval gate when the factory is reconfigured",()=>{
    const r=runExperiment({source:"aggregate",writer:"local",publisher:"both",approval:"no"});
    expect(r.artifacts).toEqual([]);
    expect(r.summary).toContain("не согласован");
    const sent=runExperiment({source:"aggregate",writer:"local",publisher:"both",approval:"yes"});
    expect(sent.artifacts[0].body).toContain("https://example.com/agents");
  });
});
