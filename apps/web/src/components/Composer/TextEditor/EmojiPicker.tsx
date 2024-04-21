import type { Emoji } from '@hey/types/misc';
import type { FC } from 'react';

import { useEditor } from 'prosekit/react';
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from 'prosekit/react/autocomplete';
import { useState } from 'react';

import type { TextEditorExtension } from './extension';

import { useEmojiQuery } from './useEmojiQuery';

export default function EmojiPicker() {
  const editor = useEditor<TextEditorExtension>();

  const handleInsert = (emoji: Emoji) => {
    editor.commands.insertMention({
      id: emoji.emoji,
      kind: 'emoji',
      value: emoji.emoji
    });
  };

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const emojis = useEmojiQuery(open, query);

  return (
    <AutocompletePopover
      className="relative z-10 box-border block w-52 select-none overflow-auto whitespace-nowrap rounded-xl border bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      offset={10}
      onOpenChange={setOpen}
      onQueryChange={setQuery}
      regex={/:\w*$/}
    >
      <AutocompleteList filter={null}>
        {emojis.length === 0 ? <EmojiEmpty /> : null}

        {emojis.map((emoji) => (
          <EmojiItem
            emoji={emoji}
            key={emoji.emoji}
            onSelect={() => handleInsert(emoji)}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
}

function EmojiEmpty() {
  return (
    <AutocompleteEmpty className="m-2 block cursor-pointer rounded-lg p-2 outline-none">
      No results
    </AutocompleteEmpty>
  );
}

function EmojiItem({
  emoji,
  onSelect
}: {
  emoji: Emoji;
  onSelect: VoidFunction;
}) {
  return (
    <AutocompleteItem
      className="focusable-dropdown-item m-2 block cursor-pointer rounded-lg p-2 outline-none"
      onSelect={onSelect}
    >
      <div className="flex items-center space-x-2">
        <span className="text-base">{emoji.emoji}</span>
        <span className="text-sm capitalize">{emoji.aliases[0]}</span>
      </div>
    </AutocompleteItem>
  );
}
