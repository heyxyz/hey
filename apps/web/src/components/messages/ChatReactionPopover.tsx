import { Popover, Transition } from '@headlessui/react';
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import { PUSH_ENV } from '@hey/data/constants';
import { Button } from '@hey/ui';
import { chat, type Message } from '@pushprotocol/restapi';
import { useMutation } from '@tanstack/react-query';
import { Fragment } from 'react';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

const emojis = [
  {
    action: 'ThumbsUp',
    emoji: '👍'
  },
  {
    action: 'ThumbsDown',
    emoji: '👎'
  },
  {
    action: 'Heart',
    emoji: '❤️'
  },
  {
    action: 'Clap',
    emoji: '👏'
  },
  {
    action: 'Smile',
    emoji: '😄'
  },
  {
    action: 'Cry',
    emoji: '😢'
  }
];

interface Props {
  reactions: string[];
  recipientAddress: string;
  reference: string;
}
const ChatReactionPopover = ({
  reactions,
  recipientAddress,
  reference
}: Props) => {
  const { data: signer } = useWalletClient();
  const pgpPrivateKey = useMessageStore((state) => state.pgpPvtKey);
  const { mutateAsync: sendReaction } = useMutation({
    mutationFn: async (message: Message) => {
      if (!signer) {
        return;
      }
      return await chat.send({
        account: signer.account.address,
        env: PUSH_ENV,
        message,
        pgpPrivateKey,
        to: recipientAddress
      });
    },
    mutationKey: ['send-reaction']
  });

  return (
    <Popover className="relative h-full">
      {() => (
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
                    key={emoji.action.toLowerCase()}
                    onClick={() => {
                      // disallowing duplication emoji reactions
                      if (!reactions.includes(emoji.emoji)) {
                        sendReaction({
                          content: emoji.emoji,
                          reference,
                          type: 'Reaction'
                        });
                      }
                    }}
                  >
                    {emoji.emoji}
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
