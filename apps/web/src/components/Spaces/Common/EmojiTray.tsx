import { useAppUtils } from '@huddle01/react/app-utils';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

const EmojiTray: FC = () => {
  const [isHandRaised, setIsHandRaised] = useState(false);
  const emojis = [
    '😂',
    '😢',
    '😦',
    '😍',
    '🤔',
    '👀',
    '🙌',
    '👍',
    '👎',
    '🔥',
    '🍻',
    '🚀',
    '🎉',
    '❤️',
    '💯'
  ];

  const { sendData } = useAppUtils();
  const setMyHandRaised = useSpacesStore((state) => state.setMyHandRaised);
  const setMyReaction = useSpacesStore((state) => state.setMyReaction);

  useUpdateEffect(() => {
    sendData('*', {
      raiseHand: isHandRaised
    });
    setMyHandRaised(isHandRaised);
  }, [isHandRaised]);

  return (
    <div className="rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="px-2 py-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHandRaised((prev) => !prev);
          }}
          className={cn(
            'font-inter flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium',
            isHandRaised
              ? 'bg-brand-100 text-brand-500 dark:bg-gray-900'
              : 'bg-brand-600 text-gray-50'
          )}
        >
          ✋ <Trans>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</Trans>
        </button>
        <div className="mt-2 grid grid-cols-5 place-items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-900">
          {emojis.map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                sendData('*', {
                  reaction: emoji
                });
                setMyReaction(emoji);
              }}
              role="presentation"
              className="m-1 cursor-pointer p-1 text-lg"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiTray;
