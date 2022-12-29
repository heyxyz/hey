import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { trimTextContentFromAnchor } from '@lexical/selection';
import { $restoreEditorState } from '@lexical/utils';
import type { EditorState } from 'lexical';
import { $getSelection, $isRangeSelection, RootNode } from 'lexical';
import { useEffect, useState } from 'react';

export const MaxLengthPlugin = ({
  maxLength,
  remainingCharactersLength
}: {
  maxLength: number;
  remainingCharactersLength: number;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [remainingCharacters, setRemainingCharacters] = useState(maxLength);

  useEffect(() => {
    let lastRestoredEditorState: EditorState | null = null;

    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return;
      }
      const prevEditorState = editor.getEditorState();
      const prevTextContent = prevEditorState.read(() => rootNode.getTextContent());
      const textContent = rootNode.getTextContent();
      if (prevTextContent !== textContent) {
        const textLength = textContent.length;
        const delCount = textLength - maxLength;
        const { anchor } = selection;
        delCount < 0 ? setRemainingCharacters(Math.abs(delCount)) : setRemainingCharacters(0);

        if (delCount > 0) {
          // Restore the old editor state instead if the last
          // text content was already at the limit.
          if (prevTextContent.length === maxLength && lastRestoredEditorState !== prevEditorState) {
            lastRestoredEditorState = prevEditorState;
            $restoreEditorState(editor, prevEditorState);
          } else {
            trimTextContentFromAnchor(editor, anchor, delCount);
          }
        }
      }
    });
  }, [editor, maxLength]);

  return (
    <div className="min-w-[10] flex items-center">
      {remainingCharactersLength >= remainingCharacters && (
        <span className="flex px-3 py-1 items-center font-bold rounded-full text-white bg-brand-500">
          {remainingCharacters}
        </span>
      )}
    </div>
  );
};

export default MaxLengthPlugin;
