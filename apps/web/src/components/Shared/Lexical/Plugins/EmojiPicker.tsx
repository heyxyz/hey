import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import clsx from 'clsx';
import { STATIC_ASSETS_URL } from 'data/constants';
import type { TextNode } from 'lexical';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

class EmojiOption extends TypeaheadOption {
  title: string;
  emoji: string;
  keywords: string[];

  constructor(
    title: string,
    emoji: string,
    options: {
      keywords?: string[];
    }
  ) {
    super(title);
    this.title = title;
    this.emoji = emoji;
    this.keywords = options.keywords || [];
  }
}

interface Props {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: EmojiOption;
}

const EmojiMenuItem: FC<Props> = ({ index, isSelected, onClick, onMouseEnter, option }) => {
  const { key, title, emoji, setRefElement } = option;

  return (
    <li
      key={key}
      tabIndex={-1}
      className={clsx({ 'dropdown-active': isSelected }, 'm-2 p-2 outline-none cursor-pointer rounded-lg')}
      ref={setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <span className="text-base">{emoji}</span>
        <span className="capitalize text-sm">{title.split('_').join(' ')}</span>
      </div>
    </li>
  );
};

type Emoji = {
  emoji: string;
  description: string;
  category: string;
  aliases: Array<string>;
  tags: Array<string>;
  unicode_version: string;
  ios_version: string;
  skin_tones?: boolean;
};

const MAX_EMOJI_SUGGESTION_COUNT = 5;

const EmojiPickerPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<Array<Emoji>>([]);

  const fetchEmojis = async () => {
    const res = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
    const data = await res.json();
    setEmojis(data);
  };

  useEffect(() => {
    fetchEmojis();
  }, []);

  const emojiOptions = useMemo(
    () =>
      emojis != null
        ? emojis.map(
            ({ emoji, aliases, tags }) =>
              new EmojiOption(aliases[0], emoji, {
                keywords: [...aliases, ...tags]
              })
          )
        : [],
    [emojis]
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0
  });

  const options: Array<EmojiOption> = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString != null
          ? new RegExp(queryString, 'gi').exec(option.title) || option.keywords != null
            ? option.keywords.some((keyword: string) => new RegExp(queryString, 'gi').exec(keyword))
            : false
          : emojiOptions;
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (selectedOption: EmojiOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return;
        }

        if (nodeToRemove) {
          nodeToRemove.remove();
        }

        selection.insertNodes([$createTextNode(selectedOption.emoji)]);

        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null;
        }

        return anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <ul className="w-52 rounded-xl border shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 mt-7">
                {options.map((option: EmojiOption, index) => (
                  <div key={option.key}>
                    <EmojiMenuItem
                      index={index}
                      isSelected={selectedIndex === index}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(index);
                      }}
                      option={option}
                    />
                  </div>
                ))}
              </ul>,
              anchorElementRef.current
            )
          : null;
      }}
    />
  );
};

export default EmojiPickerPlugin;
