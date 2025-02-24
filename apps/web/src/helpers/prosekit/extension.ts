import { LENS_NAMESPACE } from "@hey/data/constants";
import { Regex } from "@hey/data/regex";
import {
  defineBaseCommands,
  defineBaseKeymap,
  defineDoc,
  defineHistory,
  defineMarkSpec,
  defineNodeSpec,
  defineParagraph,
  defineText,
  union
} from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { defineHeading } from "prosekit/extensions/heading";
import { defineItalic } from "prosekit/extensions/italic";
import { defineLinkMarkRule, defineLinkSpec } from "prosekit/extensions/link";
import { defineMarkRule } from "prosekit/extensions/mark-rule";
import type { MentionAttrs } from "prosekit/extensions/mention";
import { defineMentionCommands } from "prosekit/extensions/mention";
import { defineModClickPrevention } from "prosekit/extensions/mod-click-prevention";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineVirtualSelection } from "prosekit/extensions/virtual-selection";

const defineHashtag = () => {
  return union([
    defineMarkSpec({
      name: "hashtag" as const,
      toDOM: () => ["span", { "data-hashtag": "" }, 0]
    }),
    defineMarkRule({
      regex: Regex.hashtag,
      type: "hashtag"
    })
  ]);
};

const defineAutoLink = () => {
  return union([defineLinkSpec(), defineLinkMarkRule()]);
};

const defineMentionSpec = () => {
  return defineNodeSpec({
    atom: true,
    attrs: { id: {}, kind: { default: "" }, value: {} },
    group: "inline",
    inline: true,
    name: "mention",
    parseDOM: [
      {
        getAttrs: (dom): MentionAttrs => {
          const el = dom as HTMLElement;
          const id = el.getAttribute("data-id") || "";
          const kind = el.getAttribute("data-mention") || "";
          const value = el.textContent?.replace(/^@(?:lens\/)?/g, "") || "";
          return { id, kind, value };
        },
        tag: "span[data-mention]"
      }
    ],
    toDOM(node) {
      const attrs = node.attrs as MentionAttrs;
      const value = attrs.value.toString();

      const children =
        attrs.kind === "account"
          ? [
              ["span", "@"],
              ["span", { class: "hidden" }, LENS_NAMESPACE],
              ["span", value]
            ]
          : [["span", value]];

      return [
        "span",
        {
          "data-id": attrs.id.toString(),
          "data-mention": attrs.kind.toString()
        },
        ...children
      ];
    }
  });
};

const defineMention = () => {
  return union([defineMentionSpec(), defineMentionCommands()]);
};

export const defineEditorExtension = () => {
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
    defineHashtag(),
    defineAutoLink(),
    defineVirtualSelection(),
    defineMention(),
    defineModClickPrevention(),
    definePlaceholder({ placeholder: "What's new?!", strategy: "doc" })
  ]);
};

export type EditorExtension = ReturnType<typeof defineEditorExtension>;
