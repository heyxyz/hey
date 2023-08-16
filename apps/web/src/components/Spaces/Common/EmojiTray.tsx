import { useAppUtils } from '@huddle01/react/app-utils';
import { useHuddle01 } from '@huddle01/react/hooks';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import { BasicIcons } from '../Common/assets/Icons';

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
  onClick: (reaction: Reaction) => void;
}

const EmojiTray: React.FC<Props> = ({ onClick, onClose }) => {
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

  const { me } = useHuddle01();
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
    <div className="rounded-lg bg-neutral-900">
      <div className="relative">
        <div className=" border-b border-slate-700 py-3 text-center text-base font-semibold text-slate-100">
          Reactions
          <span
            className="absolute right-2 cursor-pointer"
            role="presentation"
            onClick={onClose}
          >
            {BasicIcons.close}
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHandRaised((prev) => !prev);
          }}
          className={clsx(
            ' font-inter flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium text-slate-100',
            isHandRaised ? 'bg-custom-1' : 'bg-brand-600'
          )}
        >
          ✋ {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        </button>
        <div className="grid grid-cols-5 place-items-center gap-1">
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
