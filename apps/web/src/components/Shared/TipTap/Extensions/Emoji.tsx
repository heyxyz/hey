import type { Emoji } from '@hey/types/misc';
import type { NodeViewRendererProps } from '@tiptap/react';
import type { Suggestion, SuggestionProps } from '@tiptap/suggestion';

import { STATIC_ASSETS_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import { PluginKey } from '@tiptap/pm/state';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import type { NodeSuggestionOptions } from './Shared/Suggestion';

import makeSuggestionRender from './Shared/RenderSuggestionList';
import createSuggestion from './Shared/Suggestion';

type Suggestion = NodeSuggestionOptions['suggestion'];

const EmojiList = forwardRef((props: SuggestionProps<Emoji>, ref) => {
  const { command, items: emoji } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => setSelectedIndex(0), [emoji]);

  const submitUser = (index: number) => {
    const data = emoji[index];

    if (data) {
      command({
        label: data.emoji
      } as any);
    }
  };

  const onUp = () =>
    setSelectedIndex((i) => (i + emoji.length - 1) % emoji.length);
  const onDown = () => setSelectedIndex((i) => (i + 1) % emoji.length);
  const onEnter = () => submitUser(selectedIndex);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        onUp();
        return true;
      }
      if (event.key === 'ArrowDown') {
        onDown();
        return true;
      }
      if (event.key === 'Enter') {
        onEnter();
        return true;
      }
      return false;
    }
  }));

  if (emoji.length < 0) {
    return;
  }

  return (
    <div>
      {emoji.length > 0 ? (
        <div className="bg-brand sticky z-40  w-52 min-w-full rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <ul className="divide-y dark:divide-gray-700">
            {emoji.map((emoji, index) => (
              <li
                className={cn(
                  { 'dropdown-active': selectedIndex === index },
                  'm-2 cursor-pointer rounded-lg p-2 outline-none'
                )}
                id={`typeahead-item-${index}`}
                key={emoji.emoji}
                tabIndex={-1}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{emoji.emoji}</span>
                  <span className="text-sm capitalize">
                    {emoji.description.split('_').join(' ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

EmojiList.displayName = 'EmojiList';

export const emojiSuggestion: Suggestion = {
  allowedPrefixes: [' '],
  items: async ({ query }) => {
    if (query.length < 1) {
      return [];
    }
    const res = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
    const items = (await res.json()) as Emoji[];
    return items.filter((item) => item.tags.some((tag) => tag.includes(query)));
  },
  render: makeSuggestionRender(EmojiList)
};

const name = 'p';

const EmojiComponent = (props: NodeViewRendererProps) => {
  return (
    <NodeViewWrapper className={name}>
      <span>{props.node.attrs.label}</span>
    </NodeViewWrapper>
  );
};

export const EmojiPluginKey = new PluginKey('emoji');

const EmojiPicker = createSuggestion({
  pluginKey: EmojiPluginKey,
  pluginName: 'emoji',
  suggestionPrefix: ':'
});

export const EmojiPickerPlugin = EmojiPicker.extend({
  addNodeView: () =>
    ReactNodeViewRenderer(EmojiComponent, { className: 'inline-block' }),
  parseHTML: () => [{ tag: name }],
  renderHTML: ({ HTMLAttributes }) => {
    return [name, HTMLAttributes['data-label']];
  }
}).configure({ suggestion: emojiSuggestion });
