import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { QueryMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import imageProxy from '@lib/imageProxy';
import type { MediaSet, NftImage, Profile } from 'lens';
import { SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens';
import type { TextNode } from 'lexical';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { AVATAR } from 'src/constants';

import { $createMentionNode } from '../Nodes/MentionsNode';

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
const ALIAS_LENGTH_LIMIT = 50;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

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

const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
);

const checkForCapitalizedNameMentions = (text: string, minMatchLength: number): QueryMatch | null => {
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
};

const checkForAtSignMentions = (text: string, minMatchLength: number): QueryMatch | null => {
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

const getPossibleQueryMatch = (text: string): QueryMatch | null => {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
};

class MentionTypeaheadOption extends TypeaheadOption {
  name: string;
  picture: string;
  handle: string;

  constructor(name: string, picture: string, handle: string) {
    super(name);
    this.name = name;
    this.handle = handle;
    this.picture = picture;
  }
}

interface Props {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

const MentionsTypeaheadMenuItem: FC<Props> = ({ isSelected, onClick, onMouseEnter, option }) => {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className="cursor-pointer"
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="hover:bg-gray-100 flex items-center space-x-2 m-1.5 px-3 py-1 rounded-xl">
        <img
          className="rounded-full w-7 h-7"
          height="32"
          width="32"
          src={option.picture}
          alt={option.handle}
        />
        <div className="flex flex-col truncate">
          <div className="text-sm truncate">{option.name}</div>
          <span className="text-xs">{option.handle}</span>
        </div>
      </div>
    </li>
  );
};

const NewMentionsPlugin: FC = () => {
  const [queryString, setQueryString] = useState<string | null>(null);
  const [results, setResults] = useState<Array<Record<string, string>>>([]);
  const [editor] = useLexicalComposerContext();
  const [searchUsers] = useSearchProfilesLazyQuery();

  useEffect(() => {
    searchUsers({
      variables: { request: { type: SearchRequestTypes.Profile, query: queryString, limit: 5 } }
    }).then(({ data }) => {
      // @ts-ignore
      let profiles = data?.search?.items ?? [];
      profiles = profiles.map((user: Profile & { picture: MediaSet & NftImage }) => ({
        name: user?.name,
        handle: user?.handle,
        picture: user?.picture?.original?.url ?? user?.picture?.uri ?? getStampFyiURL(user?.ownedBy)
      }));
      setResults(profiles);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const options = useMemo(
    () =>
      results
        .map(({ name, picture, handle }) => {
          return new MentionTypeaheadOption(name ?? handle, imageProxy(getIPFSLink(picture), AVATAR), handle);
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const onSelectOption = useCallback(
    (selectedOption: MentionTypeaheadOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
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
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="bg-white dark:bg-gray-900 mt-8 border dark:border-gray-700/80 rounded-xl shadow-sm w-52 sticky z-40 bg-brand min-w-full">
                <ul className="divide-y dark:divide-gray-700/80">
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
};

export default NewMentionsPlugin;
