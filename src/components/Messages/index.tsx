import { useQuery } from '@apollo/client';
import Preview from '@components/Messages/Preview';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Conversation, Message } from '@xmtp/xmtp-js';
import { Client } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { useSigner } from 'wagmi';

export class MessagePreview {
  profile?: Profile;
  message?: Message;

  constructor(preview?: MessagePreview) {
    this.profile = preview?.profile;
    this.message = preview?.message;
  }
}

const Messages: FC = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messagePreviews = useMessageStore((state) => state.messagePreviews);
  const setMessagePreviews = useMessageStore((state) => state.setMessagePreviews);

  const peerAddresses = Array.from(messagePreviews.keys());
  const { error: profilesError } = useQuery(ProfilesDocument, {
    // TODO(elise): Right now this is capped at 50 profiles. We'll want to paginate.
    variables: {
      request: { ownedBy: peerAddresses, limit: 50 }
    },
    skip: !currentProfile?.id || peerAddresses.length === 0,
    onCompleted: (data) => {
      if (!data?.profiles?.items?.length) {
        return;
      }
      const profiles = data.profiles.items as Profile[];
      const newMessagePreviews = new Map(messagePreviews);
      for (const profile of profiles) {
        const peerAddress = (profile.ownedBy as string).toLowerCase();
        const messagePreview = new MessagePreview(messagePreviews.get(peerAddress));
        messagePreview.profile = profile;
        newMessagePreviews.set(peerAddress, messagePreview);
      }
      setMessagePreviews(newMessagePreviews);
    }
  });

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client) {
        const xmtp = await Client.create(signer);
        setClient(xmtp);
      }
    };
    if (isMessagesEnabled) {
      initXmtpClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  useEffect(() => {
    if (!isMessagesEnabled || !client) {
      return;
    }

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ address: string; preview: MessagePreview }> => {
      const peerAddress = convo.peerAddress.toLowerCase();
      const newMessagePreview = new MessagePreview(messagePreviews.get(peerAddress));
      // TODO(elise): Add sort direction on XMTP's side so we can grab only the most recent message.
      const newMessages = await convo.messages({ limit: 1 });
      if (newMessages.length >= 0) {
        newMessagePreview.message = newMessages[0];
      }
      return { address: peerAddress, preview: newMessagePreview };
    };

    const listConversations = async () => {
      const newMessagePreviews = new Map(messagePreviews);
      const newConversations = new Map(conversations);
      const convos = (await client?.conversations?.list()) || [];
      const previews = await Promise.all(
        convos.map(async (convo) => {
          newConversations.set(convo.peerAddress, convo);
          return await fetchMostRecentMessage(convo);
        })
      );
      for (const preview of previews) {
        newMessagePreviews.set(preview.address, preview.preview);
      }
      setMessagePreviews(newMessagePreviews);
      setConversations(newConversations);
    };

    listConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (!isMessagesEnabled) {
    return <Custom404 />;
  }

  if (profilesError) {
    return <Custom500 />;
  }

  if (!messagePreviews) {
    return null;
  }

  return (
    <GridLayout>
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <GridItemFour>
        <Card className="h-[86vh] px-2 pt-3">
          <div className="flex justify-between">
            <div className="font-black text-lg">Messages</div>
            <div>
              <button className="text-xs border border-p-100 p-1 rounded">New Message</button>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div className="text-xs">Lens profiles</div>
            <div className="text-xs">All messages</div>
          </div>

          <div>
            {Array.from(messagePreviews.values()).map((messagePreview, index) => {
              if (!messagePreview.profile || !messagePreview.message) {
                return null;
              }
              return (
                <Preview
                  key={`${messagePreview.profile.ownedBy}_${index}`}
                  profile={messagePreview.profile}
                  message={messagePreview.message}
                />
              );
            })}
          </div>
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="h-[86vh]">Hello</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
