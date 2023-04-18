import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const XMTPNoConversationSelected: FC = () => {
  return (
    <div className="m-auto">
      <span className="text-center text-5xl">👋</span>
      <h3 className="mb-2 mt-3 text-lg">
        <Trans>Select a conversation</Trans>
      </h3>
      <p className="text-md lt-text-gray-500 max-w-xs">
        <Trans>Choose an existing conversation or create a new one to start messaging</Trans>
      </p>
    </div>
  );
};

export default XMTPNoConversationSelected;
