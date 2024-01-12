import type { Profile, ProfileSearchRequest } from '@hey/lens';
import type { MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import type { FC } from 'react';

import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import cn from '@hey/ui/cn';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import isVerified from '@lib/isVerified';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useUpdateEffect } from 'usehooks-ts';

import { $createMentionNode } from '../Nodes/MentionsNode';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;
const TRIGGERS = ['@'].join('');
const VALID_CHARS = `[^${TRIGGERS}${PUNC}\\s]`;
const VALID_JOINS = `(?:\\.[ |$]| |[${PUNC}]|)`;
const LENGTH_LIMIT = 32;
const ALIAS_LENGTH_LIMIT = 50;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const AtSignMentionsRegex = new RegExp(
  `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}}))$`
);

const AtSignMentionsRegexAliasRegex = new RegExp(
  `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}){0,${ALIAS_LENGTH_LIMIT}}))$`
);

const checkForAtSignMentions = (
  text: string,
  minMatchLength: number
): MenuTextMatch | null => {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }

  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2]
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

  useUpdateEffect(() => {
    if (queryString) {
      // Variables
      const request: ProfileSearchRequest = {
        limit: LimitType.Ten,
        query: queryString,
        where: { customFilters: [CustomFiltersType.Gardeners] }
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
