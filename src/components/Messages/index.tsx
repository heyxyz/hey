import { useQuery } from '@apollo/client';
import MessagePreview from '@components/Messages/MessagePreview';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import MetaTags from '@components/utils/MetaTags';
import { Profile, ProfilesDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Client, Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { FC, useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { useSigner } from 'wagmi';

const Messages: FC = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [stream, setStream] = useState<Stream<Conversation>>();
  const [profileMap, setProfileMap] = useState<Map<string, Profile>>();
  const [messageMap, setMessageMap] = useState<Map<string, Message>>();
  const messageState = useMessageStore((state) => state);
  const { client, setClient, conversations, setConversations, loadingMessages, setLoadingMessages } =
    messageState;
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const peerAddresses = Array.from(conversations.values()).map((convo) => convo.peerAddress);
  peerAddresses.push(currentProfile?.ownedBy);
  const { loading: loadingProfiles, error: profilesError } = useQuery(ProfilesDocument, {
    // TODO(elise): Right now this isn't guaranteed to cover all profiles.
    // We'll likely have to loop through all pages since peerAddresses contains all conversations.
    variables: {
      request: { ownedBy: peerAddresses, limit: 50 }
    },
    skip: !currentProfile?.id,
    onCompleted: (data) => {
      if (!data?.profiles?.items?.length) {
        return;
      }
      const profiles = data.profiles.items as Profile[];
      const newProfileMap = new Map<string, Profile>();
      for (const profile of profiles) {
        if (newProfileMap.get(profile.ownedBy)?.isDefault) {
          return;
        }
        newProfileMap.set(profile.ownedBy, profile);
      }
      setProfileMap(newProfileMap);
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
      convo: Conversation,
      messageMap: Map<string, Message>,
      conversationMap: Map<string, Conversation>
    ) => {
      if (convo.peerAddress !== currentProfile?.ownedBy) {
        const newMessages = await convo.messages({ limit: 1 });
        if (newMessages.length === 0) {
          return;
        }
        console.log('NEW MESSAGE: ' + newMessages[0].senderAddress);
        messageMap.set(convo.peerAddress, newMessages[0]);
        conversationMap.set(convo.peerAddress, convo);
      }
    };

    const listConversations = async () => {
      const tempConversations = new Map<string, Conversation>();
      const tempMessage = new Map<string, Message>();
      setLoadingMessages(true);
      const convos = (await client?.conversations?.list()) || [];
      Promise.all([
        convos.map((convo) => {
          fetchMostRecentMessage(convo, tempMessage, tempConversations);
        })
      ]).then(() => {
        setMessageMap(tempMessage);
        setConversations(tempConversations);
        setLoadingMessages(false);
      });
    };

    const streamConversations = async () => {
      const newStream = (await client?.conversations?.stream()) || [];
      setStream(newStream);
      const newMessageMap = messageMap || new Map<string, Message>();
      for await (const convo of newStream) {
        fetchMostRecentMessage(convo, newMessageMap, conversations);
        setMessageMap(new Map(newMessageMap));
        setConversations(new Map(conversations));
      }
    };
    listConversations();
    streamConversations();
    return () => {
      const closeStream = async () => {
        if (!stream) {
          return;
        }
        await stream.return();
      };
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (!isMessagesEnabled) {
    return <Custom404 />;
  }

  if (loadingMessages || loadingProfiles) {
    return <PageLoading message="Loading messages" />;
  }

  if (profilesError) {
    return <Custom500 />;
  }

  if (!profileMap || !messageMap) {
    return null;
  }

  // TODO(elise): These aren't lining up yet!
  const profileAddy = Array.from(profileMap.keys()).map((addy) => addy);
  const messageAddy = Array.from(messageMap.keys()).map((addy) => addy);
  console.log('PROFILE MAP ADDYS: ' + profileAddy);
  console.log('MESSAGE MAP ADDYS: ' + messageAddy);

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
            {Object.entries(profileMap).map(([address, profile], index: number) => (
              <div className="p-5" key={profile?.id}>
                {messageMap.get(address) !== null ? (
                  <MessagePreview
                    key={`${address}_${index}`}
                    profile={profile}
                    message={messageMap.get(address)!}
                  />
                ) : null}
              </div>
            ))}
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
