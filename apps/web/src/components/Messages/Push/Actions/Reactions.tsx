export enum MessageReactions {
  Clap = '👏',
  Heart = '❤️',
  Laugh = '😂',
  Sad = '😢',
  ThumbsDown = '👎',
  ThumbsUp = '👍'
}

import React, { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface ReactionsProps {
  onClick: () => void;
  onValue: (value: MessageReactions) => void;
}

const Reactions = ({ onClick, onValue }: ReactionsProps) => {
  const reactionRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(reactionRef, () => onClick());

  return (
    <div
      className="flex gap-1 rounded-full border border-gray-200 bg-gray-100 p-1"
      ref={reactionRef}
    >
      {Object.values(MessageReactions)
        .reverse()
        .map((reaction) => (
          <span
            className="flex h-6 w-6 cursor-pointer  items-center justify-center rounded-full hover:bg-gray-200"
            key={reaction}
            onClick={() => onValue(reaction)}
          >
            {reaction}
          </span>
        ))}
    </div>
  );
};

const DisplayReactions = ({
  MessageReactions
}: {
  MessageReactions: MessageReactions[];
}) => {
  return (
    <div className="absolute -mt-3 ml-1 mr-4 flex">
      {MessageReactions?.map((reaction) => (
        <span
          className="flex h-5 w-5 items-center justify-center rounded-xl bg-gray-100 p-1 text-sm outline outline-1 outline-[#d4d4d8]"
          key={reaction}
        >
          {reaction}
        </span>
      ))}
    </div>
  );
};

export { DisplayReactions, Reactions };
