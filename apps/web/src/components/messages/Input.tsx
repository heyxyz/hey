import type { DisplayedMessage } from '@lib/mapReactionsToMessages';

import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/20/solid';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Button, HeyPopover } from '@hey/ui';
import { useMessageContent } from '@lib/useMessageContent';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useCallback, useRef, useState } from 'react';

const ChatMessageInput = ({
  disabled,
  onRemoveReplyMessage,
  onSend,
  onSendAttachment,
  replyMessage
}: {
  disabled?: boolean;
  onRemoveReplyMessage?: () => void;
  onSend: (message: string) => void;
  onSendAttachment: (file: File) => void;
  replyMessage: DisplayedMessage | null;
}) => {
  const [message, setMessage] = useState('');

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const onClickAddAttachment = useCallback(() => {
    attachmentInputRef.current?.click();
  }, []);

  const replyContent = useMessageContent(replyMessage);

  return (
    <div className="mx-4 my-2 flex space-x-4">
      <div className="min-w-0 flex-1">
        {replyMessage && (
          <div className="flex w-full items-center rounded border-[1px] p-1">
            <p className="text-sm font-bold text-gray-600">
              You're replying to:
            </p>
            <span className="ml-2">{replyMessage && replyContent}</span>
            <div
              className="ml-auto h-5 w-5"
              onClick={onRemoveReplyMessage}
              role="button"
            >
              <XCircleIcon />
            </div>
          </div>
        )}
        <div className="flex items-center rounded-md px-2 ring-2 ring-gray-300 focus-within:ring-2 focus-within:ring-[#EF4444]">
          <div id="mainIcons">
            <div className="flex items-center space-x-4">
              <button
                className="flex h-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                onClick={onClickAddAttachment}
                type="button"
              >
                <PaperClipIcon aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Attach a file</span>
              </button>
              <input
                accept="image/*,audio/*,video/*"
                className="hidden"
                id="chatAttachments"
                onChange={(event) => {
                  const { files } = event.target;
                  if (!files || files.length === 0) {
                    return;
                  }

                  const selectedFile = files.item(0);
                  if (!selectedFile) {
                    return;
                  }
                  onSendAttachment?.(selectedFile);
                }}
                ref={attachmentInputRef}
                type="file"
              />
              <button
                className="flex h-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                type="button"
              >
                <HeyPopover
                  content={
                    <FaceSmileIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-shrink-0"
                    />
                  }
                >
                  <EmojiPicker
                    autoFocusSearch
                    emojiStyle={EmojiStyle.NATIVE}
                    lazyLoadEmojis={true}
                    onEmojiClick={(emoji) => {
                      const currentSelection = inputRef.current?.selectionEnd;
                      if (!currentSelection) {
                        setMessage((message) => `${message} ${emoji.emoji}`);
                        return;
                      }
                      setMessage((message) => {
                        const textBeforeSelection = message.substring(
                          0,
                          currentSelection
                        );
                        const textAfterSelection =
                          message.substring(currentSelection);
                        const newMessage = `${textBeforeSelection} ${emoji.emoji} ${textAfterSelection}`;
                        inputRef.current?.focus({ preventScroll: true });

                        return newMessage;
                      });
                    }}
                    searchPlaceHolder="Search emojis"
                  />
                </HeyPopover>
              </button>
            </div>
          </div>
          <textarea
            autoFocus={true}
            className="block w-full resize-none border-0 bg-transparent py-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            disabled={disabled}
            id="message"
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
            rows={1}
            spellCheck
            value={message}
          />
          <Button
            className="flex h-8 items-center justify-center rounded-full border-0 text-gray-400 shadow-none hover:text-gray-500"
            icon={
              <PaperAirplaneIcon
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-[#EF4444]"
              />
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
