import { useLazyQuery } from '@apollo/client';
import type { MediaSet, NftImage, Profile } from '@generated/types';
import { SearchProfilesDocument, SearchRequestTypes } from '@generated/types';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { QueryMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import getStampFyiURL from '@lib/getStampFyiURL';
import type { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from './mentionsNode';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
};

const CapitalizedNameMentionsRegex = new RegExp(
  '(^|[^#])((?:' + DocumentMentionsRegex.NAME + '{' + 1 + ',})$)'
);

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

const VALID_JOINS = '(?:' + '\\.[ |$]|' + ' |' + '[' + PUNC + ']|' + ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$'
);

const ALIAS_LENGTH_LIMIT = 50;

const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
);

const SUGGESTION_LIST_LENGTH_LIMIT = 5;
function checkForCapitalizedNameMentions(text: string, minMatchLength: number): QueryMatch | null {
  const match = CapitalizedNameMentionsRegex.exec(text);
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString
      };
    }
  }
  return null;
}

function checkForAtSignMentions(text: string, minMatchLength: number): QueryMatch | null {
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
}

function getPossibleQueryMatch(text: string): QueryMatch | null {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

class MentionTypeaheadOption extends TypeaheadOption {
  name: string;
  picture: JSX.Element;
  handle: string;

  constructor(name: string, picture: JSX.Element, handle: string) {
    super(name);
    this.name = name;
    this.handle = handle;
    this.picture = picture;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = '';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="hover:bg-slate-100 flex items-center space-x-2 m-1.5 px-3 py-1 rounded-xl">
        {option.picture}
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-1">
            <div className="text-sm truncate">{option.name}</div>
          </div>
          <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400">
            {option.handle}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function NewMentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const [searchUsers] = useLazyQuery(SearchProfilesDocument);
  const [results, setResults] = useState<Array<Record<string, string>>>([]);
  useEffect(() => {
    searchUsers({
      variables: { request: { type: SearchRequestTypes.Profile, query: queryString, limit: 5 } }
    }).then(({ data }) => {
      // @ts-ignore
      let profiles = data?.search?.items ?? [];

      profiles = profiles.map((user: Profile & { picture: MediaSet & NftImage }) => ({
        name: user?.name,
        picture: user?.picture?.original?.url ?? user?.picture?.uri ?? getStampFyiURL(user?.ownedBy)
      }));
      console.log(profiles);
      setResults(profiles);
    });
  }, [queryString]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const options = useMemo(
    () =>
      results
        .map(({ name, picture, handle }) => {
          return new MentionTypeaheadOption(
            name ?? handle,
            <img className="rounded-full w-7 h-7" height="32" width="32" src={picture} alt={name} />,
            handle
          );
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const onSelectOption = useCallback(
    (selectedOption: MentionTypeaheadOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
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
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="mention-input-borderless__suggestions typeahead-popover absolute left-[44px] top-1 z-40 bg-brand rounded-md mt-4 min-w-full">
                <ul className="mention-input-borderless__suggestions__list">
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
}
