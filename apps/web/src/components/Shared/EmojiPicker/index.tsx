import type { Dispatch, FC, SetStateAction } from 'react';

import { FaceSmileIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import List from './List';

interface EmojiPickerProps {
  emoji?: null | string;
  emojiClassName?: string;
  setEmoji: (emoji: string) => void;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  showEmojiPicker: boolean;
}

const EmojiPicker: FC<EmojiPickerProps> = ({
  emoji,
  emojiClassName,
  setEmoji,
  setShowEmojiPicker,
  showEmojiPicker
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showAbove, setShowAbove] = useState(false);

  useOnClickOutside(listRef, () => setShowEmojiPicker(false));

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setShowAbove(spaceBelow < 500);
    }
  }, [showEmojiPicker]);

  return (
    <div className="relative" ref={listRef}>
      <motion.button
        className="outline-brand-500 rounded-full outline-offset-8"
        onClick={(e) => {
          e.preventDefault();
          stopEventPropagation(e);
          setShowEmojiPicker(!showEmojiPicker);
        }}
        ref={buttonRef}
        whileTap={{ scale: 0.9 }}
      >
        {emoji ? (
          <span>{emoji}</span>
        ) : (
          <Tooltip content="Emoji" placement="top">
            <FaceSmileIcon className={cn('size-5', emojiClassName)} />
          </Tooltip>
        )}
      </motion.button>
      {showEmojiPicker ? (
        <div
          className={`absolute z-[5] ${
            showAbove ? 'top-[-230px]' : 'mt-1'
          } w-[300px] rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900`}
        >
          <List setEmoji={setEmoji} />
        </div>
      ) : null}
    </div>
  );
};

export default EmojiPicker;
