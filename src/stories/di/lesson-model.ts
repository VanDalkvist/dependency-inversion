import type { StoryContext } from "../../player/contracts";
import { assembleFactory } from "./assembly";
import { runDigest } from "../../content-factory/pipeline";
export function configuration(context: StoryContext) {
  return {
    source: context.answers.source ?? "rss",
    writer: context.answers.writer ?? "cloud",
    publisher:
      context.answers.probe === "probe" || context.answers.approval === "deny"
        ? "probe"
        : (context.answers.swap ?? context.answers.channel ?? "telegram"),
    approval: context.answers.approval === "deny" ? "no" : "yes",
  };
}
export function execute(context: StoryContext, approved = true, probe = false) {
  const config = {
    ...configuration(context),
    ...(probe ? { publisher: "probe" } : {}),
    approval: approved ? "yes" : "no",
  };
  const factory = assembleFactory(config);
  const result = runDigest(
    { topic: "Выпуск собранной фабрики", limit: 3 },
    factory.ports,
    approved,
  );
  return {
    ...result,
    calls: factory.calls,
    captured: factory.captured,
    config,
    names: factory.names,
    approved,
  };
}
export type Observation = ReturnType<typeof execute>;
export function observation(context: StoryContext): Observation | undefined {
  return (context.results.approval ??
    context.results.probe ??
    context.results.swap ??
    context.results.run) as Observation | undefined;
}
