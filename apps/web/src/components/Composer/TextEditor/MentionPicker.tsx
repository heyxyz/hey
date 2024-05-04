import isVerified from '@helpers/isVerified';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { Regex } from '@hey/data/regex';
import hasMisused from '@hey/helpers/hasMisused';
import cn from '@hey/ui/cn';
import { useEditor } from 'prosekit/react';
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from 'prosekit/react/autocomplete';
import { useState } from 'react';

import type { TextEditorExtension } from './extension';
import type { MentionProfile } from './useMentionQuery';

import { useMentionQuery } from './useMentionQuery';

const MentionItem = ({
  onSelect,
  user
}: {
  onSelect: VoidFunction;
  user: MentionProfile;
}) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex items-center space-x-2 rounded-xl px-3 py-1 dark:text-white"
        onSelect={onSelect}
      >
        <img
          alt={user.handle}
          className="size-7 rounded-full"
          height="32"
          src={user.picture}
          width="32"
        />
        <div className="flex flex-col truncate">
          <div className="flex items-center space-x-1 text-sm">
            <span>{user.name}</span>
            {isVerified(user.id) ? (
              <CheckBadgeIcon className="text-brand-500 size-4" />
            ) : null}
            {hasMisused(user.id) ? (
              <ExclamationCircleIcon className="size-4 text-red-500" />
            ) : null}
          </div>
          <span className="text-xs">{user.displayHandle}</span>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const MentionPicker = () => {
  const editor = useEditor<TextEditorExtension>();

  const handleUserInsert = (profile: MentionProfile) => {
    editor.commands.insertMention({
      id: profile.id.toString(),
      kind: 'user',
      value: profile.name
    });
    editor.commands.insertText({ text: ' ' });
  };

  const [queryString, setQueryString] = useState<string>('');
  const results = useMentionQuery(queryString);

  return (
    <AutocompletePopover
      className={cn(
        'bg-brand sticky z-40 m-0 block w-52 rounded-xl border bg-white p-0 shadow-sm dark:border-gray-700 dark:bg-gray-900',
        results.length === 0 && 'hidden'
      )}
      offset={10}
      onQueryChange={setQueryString}
      regex={Regex.editorMention}
    >
      <AutocompleteList className="divide-y dark:divide-gray-700" filter={null}>
        {results.map((user) => (
          <MentionItem
            key={user.id}
            onSelect={() => handleUserInsert(user)}
            user={user}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default MentionPicker;
