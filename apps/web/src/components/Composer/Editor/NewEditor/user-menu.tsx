import type { Profile, ProfileSearchRequest } from '@hey/lens';

import { useSearchProfilesLazyQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { useEditor } from 'prosekit/react';
import { AutocompleteEmpty } from 'prosekit/react/autocomplete-empty';
import { AutocompleteItem } from 'prosekit/react/autocomplete-item';
import { AutocompleteList } from 'prosekit/react/autocomplete-list';
import { AutocompletePopover } from 'prosekit/react/autocomplete-popover';
import { useEffect, useState } from 'react';

import type { EditorExtension } from './extensions';

export default function UserMenu() {
  const editor = useEditor<EditorExtension>();
  const [searchUsers] = useSearchProfilesLazyQuery();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const request: ProfileSearchRequest = {
      query
    };

    searchUsers({ variables: { request } }).then(({ data }) => {
      const search = data?.searchProfiles;
      const profileSearchResult = search;
      const profiles = profileSearchResult?.items as Profile[];
      setProfiles(profiles);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, editor]);

  const handleUserInsert = (id: number, handle: string) => {
    editor.commands.insertMention({
      id: id.toString(),
      kind: 'profile',
      value: '@' + handle
    });
    editor.commands.insertText({ text: ' ' });
  };

  return (
    <AutocompletePopover
      className="relative z-10 box-border block max-h-[400px] min-w-[120px] select-none overflow-auto whitespace-nowrap rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-neutral-900"
      editor={editor}
      regex={/@\w*$/}
    >
      <AutocompleteList editor={editor}>
        <AutocompleteEmpty className="relative box-border block min-w-[120px] cursor-default select-none scroll-my-1 whitespace-nowrap rounded px-3 py-1.5 outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800">
          No User match
        </AutocompleteEmpty>

        {profiles?.map((profile) => (
          <AutocompleteItem
            className="relative box-border block min-w-[120px] cursor-default select-none scroll-my-1 whitespace-nowrap rounded px-3 py-1.5 outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
            key={profile.id}
            onSelect={() =>
              handleUserInsert(profile.id, profile.handle?.fullHandle)
            }
          >
            {getProfile(profile).displayName}
          </AutocompleteItem>
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
}
