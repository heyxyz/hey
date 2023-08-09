import { Menu } from '@headlessui/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import type { FC } from 'react';

import MenuTransition from '../MenuTransition';

interface CustomEmojiPickerProps {
  emoji?: string | null;
  setEmoji: (emoji: string) => void;
}

const CustomEmojiPicker: FC<CustomEmojiPickerProps> = ({ emoji, setEmoji }) => {
  const { resolvedTheme } = useTheme();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md p-1 hover:bg-gray-300/20">
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </Menu.Button>
      <MenuTransition>
        <div className="fixed z-[5] mt-1 rounded-xl border shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          <EmojiPicker
            onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
            height={320}
            lazyLoadEmojis={true}
            theme={resolvedTheme === 'dark' ? Theme['DARK'] : Theme['LIGHT']}
          />
        </div>
      </MenuTransition>
    </Menu>
  );
};

export default CustomEmojiPicker;
