import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const PUSHNoConversationSelected: FC = () => {
  return (
    <div className="m-auto text-center">
      <div className="rounded-bl-[28px] rounded-br-[28px] rounded-tl-[2px] rounded-tr-[28px] border border-gray-300 p-5 text-center text-3xl">
        Say 👋 to Lenster Messages
      </div>
      <p className="text-md lt-text-gray-500 m-auto mt-6 max-w-xs">
        <Trans>You haven’t started a conversation yet.</Trans>
      </p>
      <p className="text-md lt-text-gray-500 m-auto max-w-sm">
        <Trans>Start a new chat by searching or using the + button</Trans>
      </p>
    </div>
  );
};

export default PUSHNoConversationSelected;
