import Misuse from "@components/Shared/Profile/Icons/Misuse";
import Verified from "@components/Shared/Profile/Icons/Verified";
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
import type { MentionProfile } from "src/hooks/prosekit/useMentionQuery";
import useMentionQuery from "src/hooks/prosekit/useMentionQuery";

interface MentionItemProps {
  onSelect: VoidFunction;
  account: MentionProfile;
}

const MentionItem: FC<MentionItemProps> = ({ onSelect, account }) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-1 dark:text-white"
        onSelect={onSelect}
      >
        <Image
          alt={account.handle}
          className="size-7 rounded-full border bg-gray-200 dark:border-gray-700"
          height="28"
          src={account.picture}
          width="28"
        />
        <div className="flex flex-col truncate">
          <div className="flex items-center space-x-1 text-sm">
            <span>{account.name}</span>
            <Verified id={account.id} iconClassName="size-4" />
            <Misuse id={account.id} iconClassName="size-4" />
          </div>
          <span className="text-xs">{account.displayHandle}</span>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const MentionPicker: FC = () => {
  const editor = useEditor<EditorExtension>();
  const [queryString, setQueryString] = useState<string>("");
  const results = useMentionQuery(queryString);

  const handleProfileInsert = (profile: MentionProfile) => {
    editor.commands.insertMention({
      id: profile.id.toString(),
      kind: "profile",
      value: profile.handle
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
      regex={EditorRegex.mention}
    >
      <AutocompleteList className="divide-y dark:divide-gray-700" filter={null}>
        {results.map((profile) => (
          <MentionItem
            key={profile.id}
            onSelect={() => handleProfileInsert(profile)}
            account={profile}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default MentionPicker;
