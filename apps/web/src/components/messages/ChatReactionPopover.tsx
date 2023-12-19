import { Popover, Transition } from '@headlessui/react';
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import { Button } from '@hey/ui';
import { Fragment } from 'react';

const emojis = ['👍', '👎', '❤️', '👏', '😄', '😢'];
const ChatReactionPopover = () => {
  return (
    <Popover className="relative h-full">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
            group inline-flex items-center rounded-full bg-gray-500 bg-opacity-25 p-1 text-base font-medium focus:outline-none`}
          >
            <FaceSmileIcon
              aria-hidden="true"
              className="h-5 w-5 text-white opacity-100 transition duration-150 ease-in-out"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 transform">
              <div className="flex gap-2 overflow-hidden rounded-3xl bg-[#EF4444] bg-opacity-25 p-1 text-lg shadow-xl">
                {emojis.map((emoji) => (
                  <Button
                    className="rounded-full border-0 bg-transparent shadow-none outline-none ring-0"
                    key={emoji}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ChatReactionPopover;
