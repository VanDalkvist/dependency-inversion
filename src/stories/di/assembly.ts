import type {
  Artifact,
  Draft,
  FactoryPorts,
  Publisher,
} from "../../content-factory/contracts";
import {
  aggregateSource,
  cloudWriter,
  localWriter,
  rssSource,
  telegramPublisher,
  websitePublisher,
} from "../../content-factory/adapters";

export type DependencyCall = {
  operation: "collect" | "write" | "publish";
  implementation: string;
};
export function recordingPublisher(captured: Draft[]): Publisher {
  return {
    publish(draft) {
      captured.push(draft);
      return {
        title: "Снимок переданного Draft",
        format: "application/json",
        body: JSON.stringify(draft, null, 2),
      };
    },
  };
}

export function assembleFactory(config: Record<string, string>) {
  const outbox: Artifact[] = [];
  const captured: Draft[] = [];
  const calls: DependencyCall[] = [];
  const sources = {
    rss: { value: rssSource, name: "rssSource" },
    aggregate: { value: aggregateSource, name: "aggregateSource" },
  };
  const writers = {
    cloud: { value: cloudWriter, name: "cloudWriter" },
    local: { value: localWriter, name: "localWriter" },
  };
  const channels = {
    telegram: {
      name: "telegramPublisher",
      expression: "telegramPublisher(outbox)",
      create: () => telegramPublisher(outbox),
    },
    website: {
      name: "websitePublisher",
      expression: "websitePublisher(outbox)",
      create: () => websitePublisher(outbox),
    },
    probe: {
      name: "recordingPublisher",
      expression: "recordingPublisher(captured)",
      create: () => recordingPublisher(captured),
    },
  };
  const profiles: Record<string, readonly (keyof typeof channels)[]> = {
    telegram: ["telegram"],
    website: ["website"],
    both: ["telegram", "website"],
    probe: ["probe"],
  };
  if (
    !Object.hasOwn(sources, config.source) ||
    !Object.hasOwn(writers, config.writer) ||
    !Object.hasOwn(profiles, config.publisher)
  )
    throw new Error("Неизвестная конфигурация зависимостей");
  const source = sources[config.source as keyof typeof sources];
  const writer = writers[config.writer as keyof typeof writers];
  const publishers = profiles[config.publisher].map((id) => ({
    ...channels[id],
    value: channels[id].create(),
  }));
  const ports: FactoryPorts = {
    source: {
      collect(brief) {
        calls.push({ operation: "collect", implementation: source.name });
        return source.value.collect(brief);
      },
    },
    writer: {
      write(brief, materials) {
        calls.push({ operation: "write", implementation: writer.name });
        return writer.value.write(brief, materials);
      },
    },
    publishers: publishers.map((p) => ({
      publish(draft) {
        calls.push({ operation: "publish", implementation: p.name });
        return p.value.publish(draft);
      },
    })),
  };
  return {
    ports,
    calls,
    captured,
    names: {
      source: source.name,
      writer: writer.name,
      publishers: publishers.map((p) => p.name),
    },
    expressions: publishers.map((p) => p.expression),
  };
}
