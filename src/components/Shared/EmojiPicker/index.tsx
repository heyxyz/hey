import { Menu, Transition } from '@headlessui/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import React, { Fragment } from 'react';

import List from './List';

interface Props {
  emoji: string | null;
  setEmoji: (emoji: string | null) => void;
}

const EmojiPicker: FC<Props> = ({ emoji, setEmoji }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20">
        {emoji ? <span>{emoji}</span> : <EmojiHappyIcon className="h-5 w-5" />}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute z-[5] mt-1 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80 w-2/4">
          <List setEmoji={setEmoji} />
        </div>
      </Transition>
    </Menu>
  );
};

export default EmojiPicker;
