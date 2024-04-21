import {
  defineBaseCommands,
  defineBaseKeymap,
  defineDoc,
  defineHistory,
  defineParagraph,
  defineText,
  union
} from 'prosekit/core';
import { defineBold } from 'prosekit/extensions/bold';
import { defineCode } from 'prosekit/extensions/code';
import { defineHeading } from 'prosekit/extensions/heading';
import { defineItalic } from 'prosekit/extensions/italic';
import { defineLink } from 'prosekit/extensions/link';
import { defineMention } from 'prosekit/extensions/mention';
import { definePlaceholder } from 'prosekit/extensions/placeholder';
import { defineUnderline } from 'prosekit/extensions/underline';
import { defineVirtualSelection } from 'prosekit/extensions/virtual-selection';

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
    defineLink(),
    defineVirtualSelection(),
    defineMention(),
    definePlaceholder({ placeholder: "What's ProseKit?!", strategy: 'doc' })
  ]);
}

export type TextEditorExtension = ReturnType<typeof defineTextEditorExtension>;
