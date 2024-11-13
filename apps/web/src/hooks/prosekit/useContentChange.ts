import type { EditorExtension } from "@helpers/prosekit/extension";
import { getMarkdownContent } from "@helpers/prosekit/markdownContent";
import type { Editor } from "prosekit/core";
import { useDocChange } from "prosekit/react";
import { useCallback, useState } from "react";
import useDebouncedCallback from "src/hooks/prosekit/useDebouncedCallback";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";

const DEBOUNCE_CHARS_THRESHOLD = 3000;
const DEBOUNCE_DELAY = 500;

const useContentChange = (editor: Editor<EditorExtension>) => {
  const { setPostContent } = usePostStore();
  const [largeDocument, setLargeDocument] = useState(false);

  const setContent = useCallback(() => {
    const markdown = getMarkdownContent(editor);
    setLargeDocument(markdown.length > DEBOUNCE_CHARS_THRESHOLD);
    setPostContent(markdown);
  }, [editor, setPostContent]);

  // If the document is large, markdown serialization can be slow. We can use a
  // debounce to only serialize the document if the user is not typing.
  const delay = largeDocument ? DEBOUNCE_DELAY : 0;
  const debouncedSetContent = useDebouncedCallback(setContent, delay);

  useDocChange(debouncedSetContent, { editor });
};

export default useContentChange;
