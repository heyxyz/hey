import type { Editor } from 'prosekit/core';

import { useDocChange } from 'prosekit/react';
import { useCallback } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useDebouncedCallback } from 'src/store/non-persisted/useDebouncedCallback';

import type { EditorExtension } from './extension';

import { getMarkdownContent } from './markdownContent';

export const useContentChange = (editor: Editor<EditorExtension>) => {
  const { setPublicationContent } = usePublicationStore();

  const setContent = useCallback(() => {
    const markdown = getMarkdownContent(editor);
    setPublicationContent(markdown);
  }, [editor, setPublicationContent]);

  const debouncedSetContent = useDebouncedCallback(setContent, 500);

  useDocChange(debouncedSetContent, { editor });
};
