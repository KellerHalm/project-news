/**
 * Future Editor.js support.
 *
 * These types are intentionally kept outside the News model contract for now.
 * When Editor.js is introduced on the frontend, News.content can use this shape
 * without changing the rest of the news API.
 */
export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorJsContent {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}
