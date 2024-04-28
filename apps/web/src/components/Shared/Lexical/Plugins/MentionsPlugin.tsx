import type { Profile, ProfileSearchRequest } from '@hey/lens';
import type { MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import type { FC } from 'react';

import isVerified from '@helpers/isVerified';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import getAvatar from '@hey/helpers/getAvatar';
import getProfile from '@hey/helpers/getProfile';
import hasMisused from '@hey/helpers/hasMisused';
import { LimitType, useSearchProfilesLazyQuery } from '@hey/lens';
import cn from '@hey/ui/cn';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from '../Nodes/MentionsNode';

const SUGGESTION_LIST_LENGTH_LIMIT = 5;
const MENTION_REGEX = /@\w+(\/\w{2,25})?/;

const countWordsAfterMention = (text: string, mention: string): number => {
  const regex = new RegExp(`@${mention}\\s+(\\S+(\\s+\\S+)*)`);
  const match = text.match(regex);

  return match ? match[0].trim().split(/\s+/).length - 1 : 0;
};

const checkForAtSignMentions = (
  text: string,
  minMatchLength: number
): MenuTextMatch | null => {
  const match = MENTION_REGEX.exec(text);

  if (match !== null) {
    const matchingString = match[0].substring(1);

    if (countWordsAfterMention(match['input'], matchingString) > 0) {
      return null;
    }

    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + 1,
        matchingString,
        replaceableString: match[0]
      };
    }
  }

  return null;
};

const getPossibleQueryMatch = (text: string): MenuTextMatch | null => {
  const match = checkForAtSignMentions(text, 1);
  return match;
};

class MentionTypeaheadOption extends MenuOption {
  displayHandle: string;
  handle: string;
  id: string;
  name: string;
  picture: string;

  constructor(
    id: string,
    name: string,
    handle: string,
    displayHandle: string,
    picture: string
  ) {
    super(name);
    this.id = id;
    this.name = name;
    this.handle = handle;
    this.displayHandle = displayHandle;
    this.picture = picture;
  }
}

interface MentionsTypeaheadMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

const MentionsTypeaheadMenuItem: FC<MentionsTypeaheadMenuItemProps> = ({
  isSelected,
  onClick,
  onMouseEnter,
  option
}) => {
  return (
    <li
      className="cursor-pointer"
      key={option.key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={option.setRefElement}
      tabIndex={-1}
    >
      <div
        className={cn(
          { 'bg-gray-200 dark:bg-gray-800': isSelected },
          'm-1.5 flex items-center space-x-2 rounded-xl px-3 py-1 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800'
        )}
      >
        <img
          alt={option.handle}
          className="size-7 rounded-full"
          height="32"
          src={option.picture}
          width="32"
        />
        <div className="flex flex-col truncate">
          <div className="flex items-center space-x-1 text-sm">
            <span>{option.name}</span>
            {isVerified(option.id) ? (
              <CheckBadgeIcon className="text-brand-500 size-4" />
            ) : null}
            {hasMisused(option.id) ? (
              <ExclamationCircleIcon className="size-4 text-red-500" />
            ) : null}
          </div>
          <span className="text-xs">{option.displayHandle}</span>
        </div>
      </div>
    </li>
  );
};

const MentionsPlugin: FC = () => {
  const [queryString, setQueryString] = useState<null | string>(null);
  const [results, setResults] = useState<Record<string, string>[]>([]);
  const [editor] = useLexicalComposerContext();
  const [searchUsers] = useSearchProfilesLazyQuery();

  useEffect(() => {
    if (queryString) {
      // Variables
      const request: ProfileSearchRequest = {
        limit: LimitType.Ten,
        query: queryString
      };

      searchUsers({ variables: { request } }).then(({ data }) => {
        const search = data?.searchProfiles;
        const profileSearchResult = search;
        const profiles = profileSearchResult?.items as Profile[];
        const profilesResults = profiles?.map(
          (user) =>
            ({
              displayHandle: getProfile(user).slugWithPrefix,
              handle: user.handle?.fullHandle,
              id: user?.id,
              name: getProfile(user).displayName,
              picture: getAvatar(user)
            }) as Record<string, string>
        );
        setResults(profilesResults);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const options = useMemo(
    () =>
      results
        .map(({ displayHandle, handle, id, name, picture }) => {
          return new MentionTypeaheadOption(
            id,
            name || handle,
            handle,
            displayHandle,
            picture
          );
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: null | TextNode,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.handle);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select().insertText(' ');
        closeMenu();
      });
    },
    [editor]
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && mentionMatch ? mentionMatch : null;
    },
    [checkForSlashTriggerMatch, editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="bg-brand sticky z-40 mt-8 w-52 min-w-full rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <ul className="divide-y dark:divide-gray-700">
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      key={option.key}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={checkForMentionMatch}
    />
  );
};

export default MentionsPlugin;
