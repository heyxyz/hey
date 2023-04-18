import type { FC } from 'react';
import { MESSAGING_PROVIDER } from 'src/constants';
import { useMessageStore } from 'src/store/message';

import PUSHNoConversationSelected from './Push/PUSHNoConversationSelected';
import XMTPNoConversationSelected from './Xmtp/XMTPNoConversationSelected';

const NoConversationSelected: FC = () => {
  const chatProvider = useMessageStore((state) => state.chatProvider);

  return (
    <div className="flex h-full flex-col text-center">
      {chatProvider === MESSAGING_PROVIDER.XMTP ? (
        <XMTPNoConversationSelected />
      ) : (
        <PUSHNoConversationSelected />
      )}
    </div>
  );
};

export default NoConversationSelected;
