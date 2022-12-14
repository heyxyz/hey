import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_NORMAL, PASTE_COMMAND } from 'lexical';
import type { ClipboardEvent } from 'react';
import { useEffect } from 'react';

type ImagesPluginProps = {
  onPaste: (files: FileList) => void;
};

const ImagesPlugin = (props: ImagesPluginProps): JSX.Element | null => {
  const { onPaste } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<InputEvent & ClipboardEvent>(
        PASTE_COMMAND,
        (event) => {
          if (event) {
            const { dataTransfer, clipboardData } = event;

            // If the clipboard data contains text, we don't want to handle the image paste event.
            if (clipboardData?.getData('Text')) {
              return false;
            }

            // If the clipboard data contains files, we want to handle the image paste event.
            if (dataTransfer && dataTransfer.files.length) {
              const { files } = dataTransfer;
              onPaste && onPaste(files);
            }

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_NORMAL
      )
    );
  }, [editor, onPaste]);

  return null;
};

export default ImagesPlugin;
