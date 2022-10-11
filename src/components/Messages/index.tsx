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

const Messages: FC = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);

  const peerAddresses = Array.from(conversations.keys());
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
      const newMessageProfiles = new Map(messageProfiles);
      for (const profile of profiles) {
        const peerAddress = (profile.ownedBy as string).toLowerCase();
        newMessageProfiles.set(peerAddress, profile);
      }
      setMessageProfiles(newMessageProfiles);
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
    ): Promise<{ address: string; message?: Message }> => {
      const peerAddress = convo.peerAddress.toLowerCase();
      // TODO(elise): Add sort direction on XMTP's side so we can grab only the most recent message.
      const newMessages = await convo.messages({ limit: 1 });
      if (newMessages.length <= 0) {
        return { address: peerAddress };
      }
      return { address: peerAddress, message: newMessages[0] };
    };

    const listConversations = async () => {
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const convos = (await client?.conversations?.list()) || [];
      const previews = await Promise.all(
        convos.map(async (convo) => {
          newConversations.set(convo.peerAddress, convo);
          return await fetchMostRecentMessage(convo);
        })
      );
      for (const preview of previews) {
        if (preview.message) {
          newPreviewMessages.set(preview.address, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
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

  if (previewMessages?.size <= 0 || messageProfiles?.size <= 0) {
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
              <button className="text-xs border border-p-100 p-1 rounded" type="button">
                New Message
              </button>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div className="text-xs">Lens profiles</div>
            <div className="text-xs">All messages</div>
          </div>

          <div>
            {Array.from(messageProfiles.values()).map((profile, index) => {
              const message = previewMessages.get(profile.ownedBy.toLowerCase());
              if (!message) {
                return null;
              }
              return <Preview key={`${profile.ownedBy}_${index}`} profile={profile} message={message} />;
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
