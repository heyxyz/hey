import { EmojiHappyIcon } from '@heroicons/react/outline';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { Dispatch, FC, SetStateAction } from 'react';

import List from './List';

interface EmojiPickerProps {
  emoji?: string | null;
  setEmoji: (emoji: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
}

const EmojiPicker: FC<EmojiPickerProps> = ({
  emoji,
  setEmoji,
  showEmojiPicker,
  setShowEmojiPicker
}) => {
  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.preventDefault();
          stopEventPropagation(e);
          setShowEmojiPicker(!showEmojiPicker);
        }}
        className="rounded-md p-1 hover:bg-gray-300/20"
      >
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </div>
      {showEmojiPicker && (
        <div className="fixed z-[5] mt-1 w-2/4 w-[300px] rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          <List setEmoji={setEmoji} />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
