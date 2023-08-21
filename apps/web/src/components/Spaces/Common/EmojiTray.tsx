import { useAppUtils } from '@huddle01/react/app-utils';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

type Reaction =
  | ''
  | '😂'
  | '😢'
  | '😦'
  | '😍'
  | '🤔'
  | '👀'
  | '🙌'
  | '👍'
  | '👎'
  | '🔥'
  | '🍻'
  | '🚀'
  | '🎉'
  | '❤️'
  | '💯';

interface Props {
  onClose: () => void;
}

const EmojiTray: React.FC<Props> = ({ onClose }) => {
  const [isHandRaised, setIsHandRaised] = useState(false);
  // Emoji Data
  const emojis: Reaction[] = [
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
    <div className="rounded-lg bg-neutral-800">
      <div className="px-2 py-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHandRaised((prev) => !prev);
          }}
          className={clsx(
            'font-inter flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium text-slate-100',
            isHandRaised ? 'bg-neutral-900' : 'bg-brand-600'
          )}
        >
          ✋ {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        </button>
        <div className="mt-2 grid grid-cols-5 place-items-center gap-1 rounded-lg bg-neutral-900">
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
