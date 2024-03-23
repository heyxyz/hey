import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '@xmtp/react-sdk';
import axios from 'axios';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import Composer from './Composer';
import StartConversation from './Composer/StartConversation';
import Conversations from './Conversations';

const Messages: NextPage = () => {
  const { initialize, isLoading } = useClient();
  const { selectedConversation } = useMessagesStore();

  const fetchUserKey = async (): Promise<null | string> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/messages/key`, {
        headers: getAuthApiHeaders()
      });

      return response.data.key;
    } catch {
      return null;
    }
  };

  const { data: key } = useQuery({
    queryFn: fetchUserKey,
    queryKey: ['fetchUserKey']
  });

  const initXmtpWithKeys = async (key: string) => {
    const signer = new Wallet(key);

    await initialize({
      options: { env: 'production' },
      signer: signer as any
    });
  };

  useEffect(() => {
    if (key) {
      initXmtpWithKeys(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
