import type { RefObject } from 'react';

import {
  FaceSmileIcon,
  PaperAirplaneIcon,
  PaperClipIcon
} from '@heroicons/react/20/solid';
import { Button, Spinner } from '@hey/ui';
import { useState } from 'react';

const ChatMessageInput = ({
  disabled,
  inputRef,
  onSend,
  sending
}: {
  disabled?: boolean;
  inputRef?: null | RefObject<HTMLTextAreaElement>;
  onSend: (message: string) => void;
  sending: boolean;
}) => {
  const [message, setMessage] = useState('');
  return (
    <div className="mx-4 my-2 flex space-x-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center rounded-md px-2 ring-2 ring-gray-300 focus-within:ring-2 focus-within:ring-[#EF4444]">
          <div id="mainIcons">
            <div className="flex items-center space-x-4">
              <button
                className="flex h-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                type="button"
              >
                <PaperClipIcon aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Attach a file</span>
              </button>
              <button
                className="flex h-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                type="button"
              >
                <FaceSmileIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0"
                />
              </button>
            </div>
          </div>
          <textarea
            autoFocus={true}
            className="block w-full resize-none border-0 bg-transparent py-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            defaultValue={''}
            disabled={disabled}
            id="message"
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
            rows={1}
          />
          <Button
            className="flex h-10 items-center justify-center rounded-full border-none text-gray-400 hover:text-gray-500"
            icon={
              sending ? (
                <Spinner size="xs" />
              ) : (
                <PaperAirplaneIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-[#EF4444]"
                />
              )
            }
            onClick={() => {
              onSend(message);
              setMessage('');
            }}
            outline
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageInput;
