enum MessageReactions {
  Clap = '👏',
  Heart = '❤️',
  Laugh = '😂',
  Sad = '😢',
  ThumbsDown = '👎',
  ThumbsUp = '👍'
}

import React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface ReactionsProps {
  onClick: () => void;
  parentRef: React.RefObject<HTMLDivElement>;
}

const Reactions = ({ onClick, parentRef }: ReactionsProps) => {
  useOnClickOutside(parentRef, () => onClick());

  return (
    <div className="flex gap-1 rounded-full border border-gray-200 bg-gray-100 p-1">
      {Object.values(MessageReactions)
        .reverse()
        .map((reaction) => (
          <span
            className="flex h-6 w-6 cursor-pointer  items-center justify-center rounded-full hover:bg-gray-200"
            key={reaction}
            onClick={onClick}
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
  MessageReactions: MessageReactions;
}) => {
  return (
    <div className="flex gap-2 rounded-lg">
      {Object.values(MessageReactions).map((reaction) => (
        <span className="rounded-full p-1" key={reaction}>
          {reaction}
        </span>
      ))}
    </div>
  );
};

export { DisplayReactions, Reactions };
