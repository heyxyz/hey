import { type Editor, nodeFromHTML } from 'prosekit/core';
import { useImperativeHandle } from 'react';

import type { TextEditorExtension } from './extension';

import { htmlFromMarkdown } from './markdown';

/**
 * Some methods for operating the editor from outside the editor component.
 */
export interface TextEditorHandle {
  /**
   * Insert text at the current text cursor position.
   */
  insertText: (text: string) => void;

  /**
   * Replace the current document with the given markdown.
   */
  setMarkdown: (markdown: string) => void;
}

export type EditorRef = React.RefObject<TextEditorHandle>;

export const useEditorHandle = (
  editor: Editor<TextEditorExtension>,
  ref: React.Ref<TextEditorHandle>
): void => {
  useImperativeHandle(
    ref,
    (): TextEditorHandle => ({
      insertText: (text: string): void => {
        if (!editor.mounted) {
          return;
        }

        editor.commands.insertText({ text });
      },
      setMarkdown: (markdown: string): void => {
        if (!editor.mounted) {
          return;
        }

        const html = htmlFromMarkdown(markdown);
        const { view } = editor;
        const { state } = view;
        const doc = nodeFromHTML(html, { schema: state.schema });
        view.dispatch(
          state.tr.replaceWith(0, state.doc.content.size, doc.content)
        );
      }
    }),
    [editor]
  );
};
