import { EmojiHappyIcon } from '@heroicons/react/outline';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { type FC, useState } from 'react';

interface CustomEmojiPickerProps {
  emoji?: string | null;
  setEmoji: (emoji: string) => void;
}

const CustomEmojiPicker: FC<CustomEmojiPickerProps> = ({ emoji, setEmoji }) => {
  const { resolvedTheme } = useTheme();
  const [showList, setShowList] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setShowList(!showList)}
        className="rounded-md p-1 hover:bg-gray-300/20"
      >
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </div>
      {showList && (
        <div className="fixed z-[5] mt-1 rounded-xl border shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setShowList(!showList);
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
