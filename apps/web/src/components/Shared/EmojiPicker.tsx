import { EmojiHappyIcon } from '@heroicons/react/outline';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import type { Dispatch, FC, SetStateAction } from 'react';

interface CustomEmojiPickerProps {
  emoji?: string | null;
  setEmoji: (emoji: string) => void;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  showEmojiPicker?: boolean;
}

const CustomEmojiPicker: FC<CustomEmojiPickerProps> = ({
  emoji,
  setEmoji,
  showEmojiPicker,
  setShowEmojiPicker
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowEmojiPicker(!showEmojiPicker);
        }}
        className="rounded-md p-1 hover:bg-gray-300/20"
      >
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </div>
      {showEmojiPicker && (
        <div className="fixed left-[20px] z-[5] mt-[10px] rounded-xl border shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setShowEmojiPicker(false);
              setEmoji(emojiData.emoji);
            }}
            height={320}
            theme={resolvedTheme === 'dark' ? Theme['DARK'] : Theme['LIGHT']}
          />
        </div>
      )}
    </div>
  );
};

export default CustomEmojiPicker;
