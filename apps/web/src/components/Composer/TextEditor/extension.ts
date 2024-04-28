import { Regex } from '@hey/data/regex';
import {
  defineBaseCommands,
  defineBaseKeymap,
  defineDoc,
  defineHistory,
  defineMarkSpec,
  defineParagraph,
  defineText,
  union
} from 'prosekit/core';
import { defineBold } from 'prosekit/extensions/bold';
import { defineCode } from 'prosekit/extensions/code';
import { defineHeading } from 'prosekit/extensions/heading';
import { defineItalic } from 'prosekit/extensions/italic';
import { defineLinkMarkRule, defineLinkSpec } from 'prosekit/extensions/link';
import { defineMarkRule } from 'prosekit/extensions/mark-rule';
import { defineMention } from 'prosekit/extensions/mention';
import { definePlaceholder } from 'prosekit/extensions/placeholder';
import { defineUnderline } from 'prosekit/extensions/underline';
import { defineVirtualSelection } from 'prosekit/extensions/virtual-selection';

function defineHashtag() {
  return union([
    defineMarkSpec({
      name: 'hashtag',
      toDOM: () => ['span', { class: 'text-brand-500' }, 0]
    }),
    defineMarkRule({
      regex: Regex.hashtag,
      type: 'hashtag'
    })
  ]);
}

function defineCashtag() {
  return union([
    defineMarkSpec({
      name: 'cashtag',
      toDOM: () => ['span', { class: 'text-brand-500' }, 0]
    }),
    defineMarkRule({
      regex: Regex.cashtag,
      type: 'cashtag'
    })
  ]);
}

function defineLink() {
  return union([defineLinkMarkRule(), defineLinkSpec()]);
}

export function defineTextEditorExtension() {
  return union([
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHeading(),
    defineHistory(),
    defineBaseKeymap(),
    defineBaseCommands(),
    defineItalic(),
    defineBold(),
    defineUnderline(),
    defineCode(),
    defineHashtag(),
    defineCashtag(),
    defineLink(),
    defineVirtualSelection(),
    defineMention(),
    definePlaceholder({ placeholder: "What's ProseKit?!", strategy: 'doc' })
  ]);
}

export type TextEditorExtension = ReturnType<typeof defineTextEditorExtension>;
