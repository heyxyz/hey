import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { type FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from '../PreviewList';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';

interface MessageProps {
  conversationKey: string;
}
const Message: FC<MessageProps> = ({ conversationKey }) => {
  const [showLoading, setShowLoading] = useState(false);
  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={APP_NAME} />
      <PreviewList
        className="xs:hidden sm:hidden md:hidden lg:block"
        selectedConversationKey={conversationKey}
      />
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        <Card className="flex h-full flex-col justify-between">
          {showLoading ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <Loader message={t`Loading messages`} />
            </div>
          ) : (
            <div className="h-full">
              <MessageHeader />
              <MessageBody />
            </div>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

const MessagePage: NextPage = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile?.id);
  const {
    query: { conversationKey }
  } = useRouter();

  // useEffect(() => {
  //   Mixpanel.track(PAGEVIEW, { page: 'conversation' });
  // }, []);

  // // Need to have a login page for when there is no currentProfileId
  // if (!conversationKey || !currentProfileId || !Array.isArray(conversationKey)) {
  //   return <Custom404 />;
  // }

  // const joinedConversationKey = conversationKey.join('/');
  // const parsed = parseConversationKey(joinedConversationKey);

  // if (!parsed) {
  //   return <Custom404 />;
  // }

  // const { members } = parsed;
  // const profileId = members.find((member) => member !== currentProfileId);

  // if (!profileId) {
  //   return <Custom404 />;
  // }

  return <Message conversationKey="" />;
};

export default MessagePage;
