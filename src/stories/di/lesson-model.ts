import type { StoryContext } from "../../player/contracts";
import { assembleFactory } from "./assembly";
import { runFactory } from "./pipeline";
export function configuration(context: StoryContext) {
  return {
    source: context.answers.source ?? "rss",
    writer: context.answers.writer ?? "cloud",
    publisher:
      context.answers.probe === "probe"
        ? "probe"
        : (context.answers.swap ?? context.answers.channel ?? "telegram"),
  };
}
export function execute(context: StoryContext, probe = false) {
  const config = {
    ...configuration(context),
    ...(probe ? { publisher: "probe" } : {}),
  };
  const factory = assembleFactory(config);
  const result = runFactory(
    { topic: "Выпуск собранной фабрики", limit: 3 },
    factory.ports,
  );
  return {
    ...result,
    calls: factory.calls,
    captured: factory.captured,
    config,
    names: factory.names,
  };
}
export type Observation = ReturnType<typeof execute>;
export function observation(context: StoryContext): Observation | undefined {
  return (context.results.probe ??
    context.results.swap ??
    context.results.run) as Observation | undefined;
}
