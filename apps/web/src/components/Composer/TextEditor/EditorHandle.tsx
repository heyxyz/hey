import type { Editor } from 'prosekit/core';
import type { FC } from 'react';

import { nodeFromHTML } from 'prosekit/core';
import { createContext, useContext, useEffect, useState } from 'react';

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

const HandleContext = createContext<null | TextEditorHandle>(null);
const SetHandleContext = createContext<
  ((handle: TextEditorHandle) => void) | null
>(null);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [handle, setHandle] = useState<null | TextEditorHandle>(null);

  return (
    <HandleContext.Provider value={handle}>
      <SetHandleContext.Provider value={setHandle}>
        {children}
      </SetHandleContext.Provider>
    </HandleContext.Provider>
  );
};

/**
 * A hook for accessing the text editor handle.
 */
export const useTextEditorContext = (): null | TextEditorHandle => {
  return useContext(HandleContext);
};

/**
 * A hook to register the text editor handle.
 */
export const useTextEditorHandle = (editor: Editor<TextEditorExtension>) => {
  const setHandle = useContext(SetHandleContext);

  useEffect(() => {
    const handle: TextEditorHandle = {
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
    };

    setHandle?.(handle);
  }, [setHandle, editor]);
};

/**
 * A higher-order component for providing the text editor handle.
 */
export const withTextEditorContext = <Props extends object>(
  Component: FC<Props>
): FC<Props> => {
  const WithTextEditorContext: FC<Props> = (props: Props) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };

  return WithTextEditorContext;
};
