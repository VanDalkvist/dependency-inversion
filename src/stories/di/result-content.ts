import type { Draft, Material } from "../../content-factory/contracts";
export function materialsText(materials: Material[]): string {
  return materials
    .map((m, i) => `${i + 1}. ${m.title}\n${m.url}\n${m.excerpt}`)
    .join("\n\n");
}
export function draftText(draft: Draft): string {
  return `Заголовок\n${draft.title}\n\nВводный текст\n${draft.intro}\n\nМатериалы\n${materialsText(draft.materials)}`;
}
