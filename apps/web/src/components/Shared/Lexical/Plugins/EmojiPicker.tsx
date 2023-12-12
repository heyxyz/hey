import type { Emoji } from '@hey/types/misc';
import type { TextNode } from 'lexical';
import type { FC } from 'react';

import { STATIC_ASSETS_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useEffectOnce } from 'usehooks-ts';

class EmojiOption extends MenuOption {
  emoji: string;
  keywords: string[];
  title: string;

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

interface EmojiMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: EmojiOption;
}

const EmojiMenuItem: FC<EmojiMenuItemProps> = ({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}) => {
  const { emoji, key, setRefElement, title } = option;

  return (
    <li
      className={cn(
        { 'dropdown-active': isSelected },
        'm-2 cursor-pointer rounded-lg p-2 outline-none'
      )}
      id={`typeahead-item-${index}`}
      key={key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={setRefElement}
      tabIndex={-1}
    >
      <div className="flex items-center space-x-2">
        <span className="text-base">{emoji}</span>
        <span className="text-sm capitalize">{title.split('_').join(' ')}</span>
      </div>
    </li>
  );
};

const MAX_EMOJI_SUGGESTION_COUNT = 5;

const EmojiPickerPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<null | string>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const fetchEmojis = async () => {
    const res = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
    const data = await res.json();
    setEmojis(data);
  };

  useEffectOnce(() => {
    fetchEmojis();
  });

  const emojiOptions = useMemo(
    () =>
      emojis !== null
        ? emojis.map(
            ({ aliases, emoji, tags }) =>
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

  const options: EmojiOption[] = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString !== null
          ? new RegExp(queryString, 'gi').exec(option.title) ||
            option.keywords !== null
            ? option.keywords.some((keyword: string) =>
                new RegExp(queryString, 'gi').exec(keyword)
              )
            : false
          : emojiOptions;
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: EmojiOption,
      nodeToRemove: null | TextNode,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption === null) {
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
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current === null || options.length === 0) {
          return null;
        }

        return anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <ul className="mt-7 w-52 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
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
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={checkForTriggerMatch}
    />
  );
};

export default EmojiPickerPlugin;
