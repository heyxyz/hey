import type { Dispatch, FC, MutableRefObject, SetStateAction } from 'react';

import { FaceSmileIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useClickAway } from '@uidotdev/usehooks';
import { motion } from 'framer-motion';

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
  const listRef = useClickAway(() => {
    setShowEmojiPicker(false);
  }) as MutableRefObject<HTMLDivElement>;

  return (
    <div className="relative" ref={listRef}>
      <motion.button
        className="outline-brand-500 rounded-full outline-offset-8"
        onClick={(e) => {
          e.preventDefault();
          stopEventPropagation(e);
          setShowEmojiPicker(!showEmojiPicker);
        }}
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
        <div className="absolute z-[5] mt-1 w-[300px] rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          <List setEmoji={setEmoji} />
        </div>
      ) : null}
    </div>
  );
};

export default EmojiPicker;
