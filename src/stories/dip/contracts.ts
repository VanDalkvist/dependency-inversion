// Owned by the content factory scenario, not by an integration.
export interface Material {
  id: string;
  title: string;
  url: string;
  excerpt: string;
}
export interface Brief {
  topic: string;
  limit: number;
}
export interface Draft {
  title: string;
  intro: string;
  materials: Material[];
}
export interface Artifact {
  title: string;
  format: string;
  body: string;
}
export interface MaterialSource {
  collect(brief: Brief): Material[];
}
export interface DraftWriter {
  write(brief: Brief, materials: Material[]): Draft;
}
export interface Publisher {
  publish(draft: Draft): Artifact;
}
