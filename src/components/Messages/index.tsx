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

class ProfileMessage {
  profile?: Profile = undefined;
  message?: Message = undefined;

  constructor(profileMessage?: ProfileMessage) {
    this.profile = profileMessage?.profile;
    this.message = profileMessage?.message;
  }
}

const Messages: FC = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [stream, setStream] = useState<Stream<Conversation>>();
  const [profileMessageMap, setProfileMessageMap] = useState<Map<string, ProfileMessage>>();
  // const [profileMap, setProfileMap] = useState<Map<string, Profile>>();
  // const [messageMap, setMessageMap] = useState<Map<string, Message>>();
  const messageState = useMessageStore((state) => state);
  const { client, setClient, conversations, setConversations, loadingMessages, setLoadingMessages } =
    messageState;
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  console.log('Yo');
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
      console.log('Profiles exist');
      const profiles = data.profiles.items as Profile[];
      const newProfileMessageMap = new Map<string, ProfileMessage>();
      for (const profile of profiles) {
        const newAddress = (profile.ownedBy as string).toLowerCase();
        const profileMessage = new ProfileMessage(newProfileMessageMap.get(newAddress));
        if (profileMessage.profile?.isDefault) {
          return;
        }
        profileMessage.profile = profile;
        newProfileMessageMap.set(newAddress, profileMessage);
      }
      setProfileMessageMap(newProfileMessageMap);
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
      profileMessageMap: Map<string, ProfileMessage>,
      conversationMap: Map<string, Conversation>
    ): Promise<void> => {
      // TODO(elise): does this have to be lowercase?
      if (convo.peerAddress !== currentProfile?.ownedBy) {
        const newMessages = await convo.messages({ limit: 1 });
        if (newMessages.length === 0) {
          return;
        }
        console.log('NEW MESSAGE: ' + newMessages[0].content);
        const profileMessage = new ProfileMessage(profileMessageMap.get(convo.peerAddress));
        profileMessage.message = newMessages[0];
        profileMessageMap.set(convo.peerAddress, profileMessage);
        conversationMap.set(convo.peerAddress, convo);
      }
    };

    const listConversations = async () => {
      const tempProfileMessageMap = new Map(profileMessageMap);
      const tempConversations = new Map(conversations);
      setLoadingMessages(true);
      const convos = (await client?.conversations?.list()) || [];
      Promise.all([
        convos.map(async (convo) => {
          await fetchMostRecentMessage(convo, tempProfileMessageMap, tempConversations);
        })
      ]).then(() => {
        console.log('MSG COMPLETE!');
        setProfileMessageMap(tempProfileMessageMap);
        setConversations(tempConversations);
        setLoadingMessages(false);
      });
    };

    const streamConversations = async () => {
      const newStream = (await client?.conversations?.stream()) || [];
      setStream(newStream);
      const tempProfileMessageMap = new Map(profileMessageMap);
      const tempConversations = new Map(conversations);
      for await (const convo of newStream) {
        fetchMostRecentMessage(convo, tempProfileMessageMap, tempConversations);
        setProfileMessageMap(tempProfileMessageMap);
        setConversations(tempConversations);
      }
    };
    listConversations();
    // streamConversations();
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

  if (!profileMessageMap) {
    return null;
  }

  // TODO(elise): These aren't lining up yet!
  const addys = Array.from(profileMessageMap.keys()).map((addy) => addy);
  const values = Array.from(profileMessageMap.values()).map(
    (value) => '\nprof: ' + value.profile?.handle + ' msg: ' + value.message?.content
  );
  console.log('PROFILEMESSAGE MAP ADDYS: ' + addys);
  console.log('PROFILEMESSAGE MAP VALUES: ' + values);

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
            {Array.from(profileMessageMap.values()).map((profileMessage, index) => {
              if (!profileMessage.profile || !profileMessage.message) {
                console.log(
                  '\nprof2: ' + profileMessage.profile?.handle + ' msg2: ' + profileMessage.message?.content
                );
                return null;
              }
              return (
                <MessagePreview
                  key={`${profileMessage.profile.ownedBy}_${index}`}
                  profile={profileMessage.profile}
                  message={profileMessage.message}
                />
              );
            })}
          </div>
          {/* <div>
            {Object.entries(profileMessageMap).map(([address, profileMessage], index: number) => {
              return <MessagePreview
                key={`${address}_${index}`}
                profile={profileMessage.profile}
                message={profileMessage.message}
              />
            })}
          </div> */}
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="h-[86vh]">Hello</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
