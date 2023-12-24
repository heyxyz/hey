enum MessageReactions {
  Clap = '👏',
  Heart = '❤️',
  Laugh = '😂',
  Sad = '😢',
  ThumbsDown = '👎',
  ThumbsUp = '👍'
}

import React from 'react';

interface ReactionsProps {
  onClick: () => void;
}

const Reactions = ({ onClick }: ReactionsProps) => {
  return (
    <div className="flex gap-2 rounded-lg">
      {Object.values(MessageReactions).map((reaction) => (
        <span
          className="cursor-pointer rounded-full p-1 hover:bg-gray-200"
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
