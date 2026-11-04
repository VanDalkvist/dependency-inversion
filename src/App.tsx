import StoryPlayer from "./player/StoryPlayer";
import { dependencyInversionStory } from "./stories/dip";
// Composition root: the generic player never imports a concrete lesson.
export default function App() {
  return <StoryPlayer story={dependencyInversionStory} />;
}
