import type { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { PluginKey } from '@tiptap/pm/state';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { mergeAttributes, Node } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

export interface NodeSuggestionOptions {
  HTMLAttributes: Record<string, any>;
  renderHTML: (props: {
    node: ProseMirrorNode;
    options: NodeSuggestionOptions;
  }) => DOMOutputSpec;
  renderText: (props: {
    node: ProseMirrorNode;
    options: NodeSuggestionOptions;
  }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
}

interface SuggestionContainerOptions {
  pluginKey: PluginKey<any>;
  pluginName: string;
  suggestionPrefix: string;
}

const createSuggestion = ({
  pluginKey,
  pluginName,
  suggestionPrefix
}: SuggestionContainerOptions) => {
  return Node.create<NodeSuggestionOptions>({
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
            let isEmoji = false;
            const { selection } = state;
            const { anchor, empty } = selection;

            if (!empty) {
              return false;
            }

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                isEmoji = true;
                tr.insertText(
                  this.options.suggestion.char || '',
                  pos,
                  pos + node.nodeSize
                );

                return false;
              }
            });

            return isEmoji;
          })
      };
    },

    addOptions() {
      return {
        HTMLAttributes: {},
        renderHTML({ node, options }) {
          console.log(
            [
              'span',
              this.HTMLAttributes,
              `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            ],
            'EXPORT HTML'
          );

          return [
            'span',
            this.HTMLAttributes,
            `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          ];
        },
        renderText({ node, options }) {
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          allow: ({ range, state }) => {
            const $from = state.doc.resolve(range.from);
            const type = state.schema.nodes[this.name];
            const allow = !!$from.parent.type.contentMatch.matchType(type);

            return allow;
          },
          char: suggestionPrefix,
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
                  type: this.name
                },
                {
                  text: ' ',
                  type: 'text'
                }
              ])
              .run();

            window.getSelection()?.collapseToEnd();
          },
          pluginKey: pluginKey
        }
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

    atom: false,

    group: 'inline',

    inline: true,

    name: pluginName,

    parseHTML() {
      return [
        {
          tag: `span[data-type="${this.name}"]`
        }
      ];
    },

    renderHTML({ HTMLAttributes, node }) {
      console.log('here');
      
      const html = this.options.renderHTML({
        node,
        options: this.options
      });

      if (typeof html === 'string') {
        console.log(
          [
            'span',
            mergeAttributes(
              { 'data-type': this.name },
              this.options.HTMLAttributes,
              HTMLAttributes
            ),
            html
          ],
          'EXPORT HTML'
        );

        return [
          'span',
          mergeAttributes(
            { 'data-type': this.name },
            this.options.HTMLAttributes,
            HTMLAttributes
          ),
          html
        ];
      }
      return html;
    },

    renderText({ node }) {
      console.log('here asdsad', node);

      return this.options.renderText({
        node,
        options: this.options
      });
    },

    selectable: false
  });
};

export default createSuggestion;
