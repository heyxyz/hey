import type { FC } from 'react';

const NoConversationSelected: FC = () => {
  return (
    <div className="m-auto">
      <h3 className="mb-2 mt-3 text-lg">
        <span>Select a conversation</span>
      </h3>
      <p className="text-md lt-text-gray-500 max-w-xs">
        <span>
          Choose an existing conversation or create a new one to start messaging
        </span>
      </p>
    </div>
  );
};

export default NoConversationSelected;
