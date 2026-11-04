// Authored teaching fragments for intermediate states, not executable modules.
export function policySnapshot(flags: {
  source?: boolean;
  writer?: boolean;
  publisher?: boolean;
}): string {
  return [
    flags.source
      ? 'import type { MaterialSource } from "./editorial/contracts";'
      : 'import { readRss } from "./integrations/rss";',
    flags.writer
      ? 'import type { DraftWriter } from "./editorial/contracts";'
      : 'import { llm } from "./integrations/llm";',
    flags.publisher
      ? 'import type { Publisher } from "./editorial/contracts";'
      : 'import { telegram } from "./integrations/telegram";',
    "",
    flags.source
      ? "const materials = source.collect(brief);"
      : "const materials = await readRss(feedUrl);",
    "const selected = selectAndDeduplicate(materials);",
    flags.writer
      ? "const draft = writer.write(brief, selected);"
      : "const draft = parseProviderResponse(await llm.generate(selected));",
    "if (approved) {",
    flags.publisher
      ? "  publishers.forEach(p => p.publish(draft));"
      : '  await telegram.sendMessage(chatId, formatForTelegram(draft), { parse_mode: "HTML" });',
    "}",
  ].join("\n");
}
