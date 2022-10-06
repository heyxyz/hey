import ConversationPreview from '@components/Conversation/ConversationPreview';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { Profile } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Client, Conversation, Stream } from '@xmtp/xmtp-js';
import { FC, useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useXmtpStore } from 'src/store/xmtp';
import { useAccount, useSigner } from 'wagmi';

interface Props {
  profile: Profile;
}

const Messages: FC<Props> = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [profiles, setProfiles] = useState<Profile[]>();
  const [stream, setStream] = useState<Stream<Conversation>>();
  const xmtpState = useXmtpStore((state) => state);
  const { client, setClient, conversations, setConversations, messages, setMessages, setLoading } = xmtpState;

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client) {
        const xmtp = await Client.create(signer);
        setClient(xmtp);
      }
    };
    if (isFeatureEnabled('messages', currentProfile?.id)) {
      initXmtpClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  useEffect(() => {
    if (!client || !isFeatureEnabled('messages', currentProfile?.id)) {
      return;
    }

    // const { data, loading, error } = useQuery(Profiles, {
    //   variables: { request: { ownedBy: }, who: currentProfile?.id ?? null },
    //   skip: !username
    // });
    // const fetchProfiles = async (peerAddress: string) => {
    //   useQuery(ProfilesDocument)
    // }

    const updateMessageStore = async (convo: Conversation) => {
      if (convo.peerAddress !== address) {
        const newMessages = await convo.messages({ limit: 1 });
        messages.set(convo.peerAddress, newMessages);
        setMessages(new Map(messages));
        conversations.set(convo.peerAddress, convo);
        setConversations(new Map(conversations));
      }
    };

    const listConversations = async () => {
      setLoading(true);
      const convos = (await client?.conversations?.list()) || [];
      Promise.all(
        convos.map(async (convo) => {
          updateMessageStore(convo);
        })
      ).then(() => {
        setLoading(false);
      });
    };
    const streamConversations = async () => {
      const newStream = (await client?.conversations?.stream()) || [];
      setStream(newStream);
      for await (const convo of newStream) {
        updateMessageStore(convo);
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

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
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
            {Object.entries(conversations).map(([address, conversation], index: number) => (
              <ConversationPreview
                key={`${address}_${index}`}
                address={address}
                conversation={conversation}
              />
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
