import type { EditorExtension } from "@helpers/prosekit/extension";
import type { FC } from "react";
import type { ClubProfile } from "src/hooks/prosekit/useClubQuery";

import { EditorRegex } from "@hey/data/regex";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useEditor } from "prosekit/react";
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from "prosekit/react/autocomplete";
import { useState } from "react";
import useClubQuery from "src/hooks/prosekit/useClubQuery";

interface ClubItemProps {
  club: ClubProfile;
  onSelect: VoidFunction;
}

const ClubItem: FC<ClubItemProps> = ({ club, onSelect }) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-1 dark:text-white"
        onSelect={onSelect}
      >
        <Image
          alt={club.handle}
          className="size-7 rounded-full border bg-gray-200 dark:border-gray-700"
          height="28"
          src={club.picture}
          width="28"
        />
        <div className="flex flex-col truncate">
          <span>{club.name}</span>
          <span className="text-xs">{club.displayHandle}</span>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const ClubPicker: FC = () => {
  const editor = useEditor<EditorExtension>();
  const [queryString, setQueryString] = useState<string>("");
  const results = useClubQuery(queryString);

  const handleClubInsert = (club: ClubProfile) => {
    editor.commands.insertMention({
      id: club.id.toString(),
      kind: "club",
      value: club.displayHandle
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      className={cn(
        "z-10 block w-52 rounded-xl border bg-white p-0 shadow-sm dark:border-gray-700 dark:bg-gray-900",
        results.length === 0 && "hidden"
      )}
      offset={10}
      onQueryChange={setQueryString}
      regex={EditorRegex.club}
    >
      <AutocompleteList className="divide-y dark:divide-gray-700" filter={null}>
        {results.map((club) => (
          <ClubItem
            club={club}
            key={club.id}
            onSelect={() => handleClubInsert(club)}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default ClubPicker;
