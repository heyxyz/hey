import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import useGetConversation from '@components/utils/hooks/useGetConversation';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import { useGetProfile } from '@components/utils/hooks/useMessageDb';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import useStreamMessages from '@components/utils/hooks/useStreamMessages';
import { parseConversationKey } from '@lib/conversationKey';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import formatHandle from 'lib/formatHandle';
import sanitizeDisplayName from 'lib/sanitizeDisplayName';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridLayout } from 'ui';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

interface MessageProps {
  conversationKey: string;
}

const Message: FC<MessageProps> = ({ conversationKey }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { profile } = useGetProfile(currentProfile?.id, conversationKey);
  const { selectedConversation, missingXmtpAuth } = useGetConversation(
    conversationKey,
    profile
  );
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  );
  useStreamMessages(conversationKey, selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent;
      const currentEndTime = endTime.get(conversationKey);
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate);
        setEndTime(new Map(endTime));
      }
    }
  }, [conversationKey, hasMore, messages, endTime]);

  if (!currentProfile) {
    return <Custom404 />;
  }

  const showLoading =
    !missingXmtpAuth && (!profile || !currentProfile || !selectedConversation);

  const userNameForTitle =
    sanitizeDisplayName(profile?.name) ?? formatHandle(profile?.handle);
  const title = userNameForTitle
    ? `${userNameForTitle} • ${APP_NAME}`
    : APP_NAME;

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={title} />
      <PreviewList
        className="xs:hidden sm:hidden md:hidden lg:block"
        selectedConversationKey={conversationKey}
      />
      <GridItemEight className="xs:mx-2 relative mb-0 sm:mx-2 md:col-span-8">
        <Card className="flex h-[87vh] flex-col justify-between">
          {showLoading ? (
            <div className="flex h-full grow items-center justify-center">
              <Loader message={t`Loading messages`} />
            </div>
          ) : (
            <>
              <MessageHeader profile={profile} />
              <MessagesList
                currentProfile={currentProfile}
                profile={profile}
                fetchNextMessages={fetchNextMessages}
                messages={messages ?? []}
                hasMore={hasMore}
                missingXmtpAuth={missingXmtpAuth ?? false}
              />
              <Composer
                sendMessage={sendMessage}
                conversationKey={conversationKey}
                disabledInput={missingXmtpAuth ?? false}
              />
            </>
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

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'conversation' });
  }, []);

  // Need to have a login page for when there is no currentProfileId
  if (
    !conversationKey ||
    !currentProfileId ||
    !Array.isArray(conversationKey)
  ) {
    return <Custom404 />;
  }

  const joinedConversationKey = conversationKey.join('/');
  const parsed = parseConversationKey(joinedConversationKey);

  if (!parsed) {
    return <Custom404 />;
  }

  const { members } = parsed;
  const profileId = members.find((member) => member !== currentProfileId);

  if (!profileId) {
    return <Custom404 />;
  }

  return <Message conversationKey={joinedConversationKey} />;
};

export default MessagePage;
