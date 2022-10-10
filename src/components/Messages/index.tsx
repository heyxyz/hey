import { useQuery } from '@apollo/client';
import Preview from '@components/Messages/Preview';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
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
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const loadingMessages = useMessageStore((state) => state.loadingMessages);
  const setLoadingMessages = useMessageStore((state) => state.setLoadingMessages);
  const messagePreviews = useMessageStore((state) => state.messagePreviews);
  const setMessagePreviews = useMessageStore((state) => state.setMessagePreviews);
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const peerAddresses = Array.from(conversations.values()).map((convo) => convo.peerAddress);
  console.log('PEER ADDRESSES: ' + peerAddresses);
  console.log('MY ADDY: ' + currentProfile?.ownedBy);
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
      const newMessagePreviews = new Map<string, MessagePreview>();
      console.log('NEW PROF: all mps: ' + Array.from(messagePreviews.keys()).map((addy) => addy));
      for (const profile of profiles) {
        // TODO(elise): lowercase necessary?
        const newAddress = (profile.ownedBy as string).toLowerCase();
        console.log('NEW PROF: prof addy: ' + newAddress);
        const messagePreview = new MessagePreview(newMessagePreviews.get(newAddress));
        console.log('NEW PROF: existing mp msg: ' + messagePreview.message?.content);
        if (messagePreview.profile?.isDefault) {
          return;
        }
        messagePreview.profile = profile;
        newMessagePreviews.set(newAddress, messagePreview);
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
      const newMessagePreview = new MessagePreview(messagePreviews.get(convo.peerAddress.toLowerCase()));
      // if (convo.peerAddress !== currentProfile?.ownedBy) {
      const newMessages = await convo.messages({ limit: 1 });
      if (newMessages.length === 0) {
        return { address: convo.peerAddress, preview: newMessagePreview };
      }
      // TODO(elise): lowercase?
      console.log('NEW MSG: all mps: ' + Array.from(messagePreviews.keys()).map((addy) => addy));
      console.log('NEW MSG: convo addy: ' + convo.peerAddress);
      console.log('NEW MSG: existing mp prof: ' + newMessagePreview?.profile?.ownedBy);
      newMessagePreview.message = newMessages[0];
      // }
      return { address: convo.peerAddress, preview: newMessagePreview };
    };

    const listConversations = async () => {
      setLoadingMessages(true);
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
      setLoadingMessages(false);
      // newMessagePreviews.set()
      // // .then((result) => {
      //   // const [previews] = result;
      //   previews.map((preview) => {
      //     newMessagePreviews.set(preview.)
      //   });
      //   console.log('THEN: before mps :' + Array.from(messagePreviews.keys()).map((addy) => addy));
      //   setMessagePreviews(newMessagePreviews);
      //   console.log('THEN: after mps :' + Array.from(messagePreviews.keys()).map((addy) => addy));
      //   setConversations(newConversations);
      //   setLoadingMessages(false);
      // });
    };

    listConversations();
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

  if (!messagePreviews) {
    return null;
  }

  // // TODO(elise): These aren't lining up yet!
  // const addys = Array.from(messagePreviews.keys()).map((addy) => addy);
  // const values = Array.from(messagePreviews.values()).map(
  //   (value) => '\nprof: ' + value.profile?.handle + ' msg: ' + value.message?.content
  // );
  // console.log('PROFILEMESSAGE MAP ADDYS: ' + addys);
  // console.log('PROFILEMESSAGE MAP VALUES: ' + values);

  console.log('Rerender');
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
                console.log(
                  'Missing: ' + messagePreview.profile?.handle + ' msg: ' + messagePreview.message?.content
                );
                return null;
              } else {
                console.log(
                  'Match: ' + messagePreview.profile?.handle + ' msg: ' + messagePreview.message?.content
                );
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
