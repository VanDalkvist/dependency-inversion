import type {
  Artifact,
  Draft,
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

import { observePorts, type DependencyCall } from "./observe-ports";
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

function createChannels(outbox: Artifact[], captured: Draft[]) {
  return {
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
}

function selectImplementations(
  config: Record<string, string>,
  channels: ReturnType<typeof createChannels>,
) {
  const sources = {
    rss: { value: rssSource, name: "rssSource" },
    aggregate: { value: aggregateSource, name: "aggregateSource" },
  };
  const writers = {
    cloud: { value: cloudWriter, name: "cloudWriter" },
    local: { value: localWriter, name: "localWriter" },
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
  return { source, writer, publishers };
}

export function assembleFactory(config: Record<string, string>) {
  const outbox: Artifact[] = [];
  const captured: Draft[] = [];
  const calls: DependencyCall[] = [];
  const channels = createChannels(outbox, captured);
  const { source, writer, publishers } = selectImplementations(
    config,
    channels,
  );
  const names = {
    source: source.name,
    writer: writer.name,
    publishers: publishers.map((p) => p.name),
  };
  const ports = observePorts(
    {
      source: source.value,
      writer: writer.value,
      publishers: publishers.map((p) => p.value),
    },
    names,
    calls,
  );
  return {
    ports,
    calls,
    captured,
    names,
    expressions: publishers.map((p) => p.expression),
  };
}
