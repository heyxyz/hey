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
import { defineStrike } from 'prosekit/extensions/strike';
import { defineUnderline } from 'prosekit/extensions/underline';
import { defineVirtualSelection } from 'prosekit/extensions/virtual-selection';

const defineHashtag = () => {
  return union([
    defineMarkSpec({
      name: 'hashtag' as const,
      toDOM: () => ['span', { 'data-hashtag': '' }, 0]
    }),
    defineMarkRule({
      regex: Regex.hashtag,
      type: 'hashtag'
    })
  ]);
};

const defineCashtag = () => {
  return union([
    defineMarkSpec({
      name: 'cashtag' as const,
      toDOM: () => ['span', { 'data-cashtag': '' }, 0]
    }),
    defineMarkRule({
      regex: Regex.cashtag,
      type: 'cashtag'
    })
  ]);
};

const defineAutoLink = () => {
  return union([defineLinkSpec(), defineLinkMarkRule()]);
};

export const defineTextEditorExtension = () => {
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
    defineStrike(),
    defineUnderline(),
    defineCode(),
    defineHashtag(),
    defineCashtag(),
    defineAutoLink(),
    defineVirtualSelection(),
    defineMention(),
    definePlaceholder({ placeholder: "What's ProseKit?!", strategy: 'doc' })
  ]);
};

export type TextEditorExtension = ReturnType<typeof defineTextEditorExtension>;
