import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useClient } from '@xmtp/react-sdk';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import Composer from './Composer';
import StartConversation from './Composer/StartConversation';
import Conversations from './Conversations';

const Messages: NextPage = () => {
  const { initialize, isLoading } = useClient();
  const { selectedConversation } = useMessagesStore();

  const signer = new Wallet(
    '0x6f430410c561e6f833c8406c34f6089b741728cbb4d956db587cd2994193a4e3'
    // '0x7690a8c963e7f5f7d465f4a7b84ec72a1c585bcc1f5dc510a4a1a49a553c3c67'
  );

  const initXmtpWithKeys = async () => {
    await initialize({
      options: { env: 'production' },
      signer: signer as any
    });
  };

  useEffect(() => {
    initXmtpWithKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridLayout>
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <GridItemFour>
        <Card className="p-5">
          {isLoading ? 'Loading XMTP...' : <Conversations />}
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <StartConversation />
          {selectedConversation && (
            <Composer conversation={selectedConversation} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
