import type { Editor } from 'prosekit/core';

import { htmlFromNode } from 'prosekit/core';
import { ListDOMSerializer } from 'prosekit/extensions/list';
import { useDocChange } from 'prosekit/react';
import { useCallback } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useDebouncedCallback } from 'src/store/non-persisted/useDebouncedCallback';

import type { TextEditorExtension } from './extension';

import { markdownFromHTML } from './markdown';

export function useContentChange(editor: Editor<TextEditorExtension>) {
  const { setPublicationContent } = usePublicationStore();

  const setContent = useCallback(() => {
    const { doc } = editor.view.state;
    const html = htmlFromNode(doc, { DOMSerializer: ListDOMSerializer });
    const markdown = markdownFromHTML(html);
    setPublicationContent(markdown);
  }, [editor, setPublicationContent]);

  const debouncedSetContent = useDebouncedCallback(setContent, 500);

  useDocChange(debouncedSetContent, { editor });
}
