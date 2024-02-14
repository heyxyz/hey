import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { mergeAttributes, Node } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';

export type HashtagOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    node: ProseMirrorNode;
    options: HashtagOptions;
  }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const HashtagPluginKey = new PluginKey('hashtag');

export const Hashtag = Node.create<HashtagOptions>({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id
          };
        }
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label
          };
        }
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ state, tr }) => {
          let isMention = false;
          const { selection } = state;
          const { anchor, empty } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(
                this.options.suggestion.char || '',
                pos,
                pos + node.nodeSize
              );

              return false;
            }
          });

          return isMention;
        })
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  },

  atom: true,

  defaultOptions: {
    HTMLAttributes: {},
    renderLabel({ node, options }) {
      return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
    },
    suggestion: {
      allow: ({ editor, range }) => {
        return editor.can().insertContentAt(range, { type: 'hashtag' });
      },
      char: '#',
      command: ({ editor, props, range }) => {
        // increase range.to by one when the next node is of type "text"
        // and starts with a space character
        const { nodeAfter } = editor.view.state.selection.$to;
        const overrideSpace = nodeAfter?.text?.startsWith(' ');

        if (overrideSpace) {
          range.to += 1;
        }

        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              attrs: props,
              type: 'hashtag'
            },
            {
              text: ' ',
              type: 'text'
            }
          ])
          .run();
      },
      pluginKey: HashtagPluginKey
    }
  },

  group: 'inline',

  inline: true,

  name: 'hashtag',

  parseHTML() {
    return [
      {
        tag: 'span[data-hashtag]'
      }
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes(
        { 'data-hashtag': '' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        node,
        options: this.options
      })
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      node,
      options: this.options
    });
  },

  selectable: false
});
