import type { Editor } from 'prosekit/core';

import { useImperativeHandle } from 'react';

import type { TextEditorExtension } from './extension';

export interface TextEditorHandle {
  insertText: (emoji: string) => void;
}

export const useEditorHandle = (
  editor: Editor<TextEditorExtension>,
  ref: React.Ref<TextEditorHandle>
): void => {
  useImperativeHandle(
    ref,
    (): TextEditorHandle => ({
      insertText: (text: string): void => {
        if (editor.mounted) {
          editor.commands.insertText({ text });
        }
      }
    }),
    [editor]
  );
};
