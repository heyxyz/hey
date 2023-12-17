import {
  FaceSmileIcon,
  GifIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  PhotoIcon
} from '@heroicons/react/20/solid';
import { Button } from '@hey/ui';

import ChatList from './ChatList';

const ChatListItemContainer = () => {
  return (
    <div className="flex max-h-[800px] pl-6">
      <ChatList />
      <div className="border-l border-gray-300" />
      <div className="m-auto mx-10 hidden w-full">
        <h2 className="text-2xl">Select a message</h2>
        <p className="text-sm text-gray-600">
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </p>
        <Button className="my-4" size="lg">
          New message
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between">
        <div className="flex items-center justify-between bg-white p-4 sm:px-6">
          <span>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              b4s36t4
            </h3>
            <p className="mt-1 text-sm text-gray-500">last seen at 03:43</p>
          </span>
          <InformationCircleIcon
            aria-hidden="true"
            className="h-5 w-5 text-[#EF4444]"
          />
        </div>
        <div className="h-screen space-y-3 overflow-auto px-4">
          <div className="text-wrap max-w-[40%] rounded-3xl rounded-bl-sm bg-gray-300 p-4">
            Ah okay, currently I'm have quite busy but when I have more free
            time and got the interesting idea, I will ping you, man 😉
          </div>
          <div className="text-wrap ml-auto max-w-[40%] rounded-3xl rounded-br-sm bg-[#EF4444] p-4 text-white">
            Ah okay, currently I'm have quite busy but when I have more free
            time and got the interesting idea, I will ping you, man 😉
          </div>
        </div>
        <div className="relative mx-4 mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center space-x-2 pl-3">
            <PhotoIcon aria-hidden="true" className="h-5 w-5 text-[#EF4444]" />
            <GifIcon aria-hidden="true" className="h-5 w-5 text-[#EF4444]" />
            <FaceSmileIcon
              aria-hidden="true"
              className="h-5 w-5 text-[#EF4444]"
            />
          </div>
          <input
            className="block w-full rounded-md border-0 py-1.5 pl-24 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-[#EF4444] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            id="email"
            name="email"
            placeholder="Type a message"
            type="email"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <PaperAirplaneIcon className="h-5 w-5 text-[#EF4444]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItemContainer;
