import type { EditorExtension } from "@helpers/prosekit/extension";
import { EditorRegex } from "@hey/data/regex";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useEditor } from "prosekit/react";
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from "prosekit/react/autocomplete";
import type { FC } from "react";
import { useState } from "react";
import type { GroupProfile } from "src/hooks/prosekit/useGroupQuery";
import useGroupQuery from "src/hooks/prosekit/useGroupQuery";

interface GroupItemProps {
  group: GroupProfile;
  onSelect: VoidFunction;
}

const GroupItem: FC<GroupItemProps> = ({ group, onSelect }) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-1 dark:text-white"
        onSelect={onSelect}
      >
        <Image
          alt={group.handle}
          className="size-7 rounded-full border bg-gray-200 dark:border-gray-700"
          height="28"
          src={group.picture}
          width="28"
        />
        <div className="flex flex-col truncate">
          <span>{group.name}</span>
          <span className="text-xs">{group.handle}</span>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const GroupPicker: FC = () => {
  const editor = useEditor<EditorExtension>();
  const [queryString, setQueryString] = useState<string>("");
  const results = useGroupQuery(queryString);

  const handleGroupInsert = (group: GroupProfile) => {
    editor.commands.insertMention({
      id: group.address,
      kind: "group",
      value: group.handle
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
      regex={EditorRegex.group}
    >
      <AutocompleteList className="divide-y dark:divide-gray-700" filter={null}>
        {results.map((group) => (
          <GroupItem
            group={group}
            key={group.address}
            onSelect={() => handleGroupInsert(group)}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default GroupPicker;
