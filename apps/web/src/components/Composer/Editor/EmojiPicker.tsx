import type { Emoji } from '@hey/types/misc';

import { Regex } from '@hey/data/regex';
import cn from '@hey/ui/cn';
import { useEditor } from 'prosekit/react';
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from 'prosekit/react/autocomplete';
import { useState } from 'react';

import type { EditorExtension } from './extension';

import { useEmojiQuery } from './useEmojiQuery';

const EmojiItem = ({
  emoji,
  onSelect
}: {
  emoji: Emoji;
  onSelect: VoidFunction;
}) => {
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
};

const EmojiPicker = () => {
  const editor = useEditor<EditorExtension>();

  const handleInsert = (emoji: Emoji) => {
    editor.commands.insertText({ text: emoji.emoji });
  };

  const [query, setQuery] = useState('');
  const emojis = useEmojiQuery(query);

  return (
    <AutocompletePopover
      className={cn(
        'relative z-10 box-border block w-52 select-none overflow-auto whitespace-nowrap rounded-xl border bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900',
        emojis.length === 0 && 'hidden'
      )}
      offset={10}
      onQueryChange={setQuery}
      regex={Regex.emoji}
    >
      <AutocompleteList filter={null}>
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
};

export default EmojiPicker;
