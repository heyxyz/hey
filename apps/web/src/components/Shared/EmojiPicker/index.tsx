import { Menu } from '@headlessui/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

import MenuTransition from '../MenuTransition';
import List from './List';

interface Props {
  emoji: string | null;
  setEmoji: (emoji: string) => void;
}

const EmojiPicker: FC<Props> = ({ emoji, setEmoji }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20">
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </Menu.Button>
      <MenuTransition>
        <div className="fixed z-[5] mt-1 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700 w-2/4">
          <List setEmoji={setEmoji} />
        </div>
      </MenuTransition>
    </Menu>
  );
};

export default EmojiPicker;
