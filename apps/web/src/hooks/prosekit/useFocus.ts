import type { EditorExtension } from "@helpers/prosekit/extension";
import type { Editor } from "prosekit/core";

import { useEffect } from "react";

const useFocus = (editor: Editor<EditorExtension>) => {
  useEffect(() => {
    editor.focus();
  }, [editor]);
};

export default useFocus;
