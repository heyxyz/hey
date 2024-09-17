import type { EditorExtension } from "@helpers/prosekit/extension";
import type { Editor } from "prosekit/core";

import { htmlFromMarkdown, markdownFromHTML } from "@helpers/prosekit/markdown";
import { htmlFromNode, nodeFromHTML } from "prosekit/core";
import { ListDOMSerializer } from "prosekit/extensions/list";

/**
 * Get the editor content in markdown format.
 */
export const getMarkdownContent = (editor: Editor<EditorExtension>): string => {
  if (!editor.mounted) {
    return "";
  }

  const { doc } = editor.view.state;
  const html = htmlFromNode(doc, { DOMSerializer: ListDOMSerializer });
  return markdownFromHTML(html);
};

/**
 * Set the editor content in markdown format.
 */
export const setMarkdownContent = (
  editor: Editor<EditorExtension>,
  markdown: string
): void => {
  if (!editor.mounted) {
    return;
  }

  const html = htmlFromMarkdown(markdown);
  const { view } = editor;
  const { state } = view;
  const doc = nodeFromHTML(html, { schema: state.schema });
  view.dispatch(state.tr.replaceWith(0, state.doc.content.size, doc.content));
};
