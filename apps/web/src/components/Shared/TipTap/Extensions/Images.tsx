import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const Images = ({ onPaste }: { onPaste: (files: FileList) => void }) => {
  return Extension.create({
    addOptions() {
      return {
        onPaste: onPaste
      };
    },

    addProseMirrorPlugins() {
      const { onPaste } = this.options;

      return [
        new Plugin({
          key: new PluginKey('images'),
          props: {
            handleDOMEvents: {
              paste: (view, event) => {
                const hasFiles =
                  event.clipboardData &&
                  event.clipboardData.files &&
                  event.clipboardData.files.length;

                if (!hasFiles) {
                  return false;
                }

                const images = Array.from(event.clipboardData.files).filter(
                  (file) => /image/i.test(file.type)
                );

                if (images.length === 0) {
                  return false;
                }

                event.preventDefault();
                onPaste(event.clipboardData.files);

                return true;
              }
            }
          }
        })
      ];
    },

    name: 'images'
  });
};

export default Images;
