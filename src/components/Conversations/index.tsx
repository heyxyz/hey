import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Profile } from '@generated/types';
import { Client } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useXmtpStore } from 'src/store/xmtp';
import { useAccount, useSigner } from 'wagmi';

interface Props {
  profile: Profile;
}

const Conversations: FC<Props> = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const xmtpState = useXmtpStore((state) => state);
  const { client, setClient, conversations, setConversations, messages, setMessages, setLoading } = xmtpState;
  const router = useRouter();

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer) {
        const xmtp = await Client.create(signer);
        setClient(xmtp);
      }
    };
    initXmtpClient();
  }, [signer]);

  useEffect(() => {
    if (!client) {
      return;
    }

    async function listConversations() {
      setLoading(true);
      const convos = (await client?.conversations?.list()) || [];
      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== address) {
            const newMessages = await convo.messages();
            messages.set(convo.peerAddress, newMessages);
            setMessages(new Map(messages));
            conversations.set(convo.peerAddress, convo);
            setConversations(new Map(conversations));
          }
        })
      ).then(() => {
        setLoading(false);
      });
    }
    const streamConversations = async () => {
      const stream = (await client?.conversations?.stream()) || [];
      for await (const convo of stream) {
        if (convo.peerAddress !== address) {
          const newMessages = await convo.messages();
          messages.set(convo.peerAddress, newMessages);
          setMessages(new Map(messages));
          conversations.set(convo.peerAddress, convo);
          setConversations(new Map(conversations));
        }
      }
    };
    listConversations();
    streamConversations();
  }, [client]);

  const onConversationSelected = (address: string) => {
    router.push(address ? `/conversations/${address}` : '/conversations/');
  };

  return (
    <GridLayout>
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
            {Array.from(conversations.keys()).map((convo: string) => {
              return (
                <div
                  onClick={() => onConversationSelected(convo)}
                  key={`convo_${convo}`}
                  className="border p-5 text-xs"
                >
                  {convo}
                </div>
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

export default Conversations;
