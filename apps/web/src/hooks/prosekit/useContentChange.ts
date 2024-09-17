import type { EditorExtension } from "@helpers/prosekit/extension";
import type { Editor } from "prosekit/core";

import { getMarkdownContent } from "@helpers/prosekit/markdownContent";
import { useDocChange } from "prosekit/react";
import { useCallback, useState } from "react";
import useDebouncedCallback from "src/hooks/prosekit/useDebouncedCallback";
import { usePublicationStore } from "src/store/non-persisted/publication/usePublicationStore";

const DEBOUNCE_CHARS_THRESHOLD = 3000;
const DEBOUNCE_DELAY = 500;

const useContentChange = (editor: Editor<EditorExtension>) => {
  const { setPublicationContent } = usePublicationStore();

  const [largeDocument, setLargeDocument] = useState(false);

  const setContent = useCallback(() => {
    const markdown = getMarkdownContent(editor);
    setLargeDocument(markdown.length > DEBOUNCE_CHARS_THRESHOLD);
    setPublicationContent(markdown);
  }, [editor, setPublicationContent]);

  // If the document is large, markdown serialization can be slow. We can use a
  // debounce to only serialize the document if the user is not typing.
  const delay = largeDocument ? DEBOUNCE_DELAY : 0;
  const debouncedSetContent = useDebouncedCallback(setContent, delay);

  useDocChange(debouncedSetContent, { editor });
};

export default useContentChange;
