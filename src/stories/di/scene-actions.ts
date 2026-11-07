import type { StoryAction } from "../../player/contracts";
export const action = (
  id: string,
  label: string,
  feedback: string,
  correct = true,
  perform?: StoryAction["perform"],
): StoryAction => ({ id, label, feedback, correct, perform });
