import { defineBasicExtension } from 'prosekit/basic';
import { union } from 'prosekit/core';
import { defineMention } from 'prosekit/extensions/mention';
import { definePlaceholder } from 'prosekit/extensions/placeholder';

export function defineExtension() {
  return union([
    defineBasicExtension(),
    definePlaceholder({
      placeholder: "What's new?!"
    }),
    defineMention()
  ]);
}

export type EditorExtension = ReturnType<typeof defineExtension>;
