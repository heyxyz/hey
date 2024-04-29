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

const EMAIL_MATCHER =
  /(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))/g;

function defineHashtag() {
  return union([
    defineMarkSpec({
      name: 'hashtag' as const,
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
      name: 'cashtag' as const,
      toDOM: () => ['span', { class: 'text-brand-500' }, 0]
    }),
    defineMarkRule({
      regex: Regex.cashtag,
      type: 'cashtag'
    })
  ]);
}

function defineEmailMarkRule() {
  return defineMarkRule({
    attrs: (match) => ({ href: match[1] }),
    regex: EMAIL_MATCHER,
    type: 'link'
  });
}

function defineAutoLink() {
  return union([defineLinkSpec(), defineLinkMarkRule(), defineEmailMarkRule()]);
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
}

export type TextEditorExtension = ReturnType<typeof defineTextEditorExtension>;
