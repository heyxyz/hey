import { Profile } from '@generated/types';
import { Client } from '@xmtp/xmtp-js';
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

  return <div>Hello</div>;
};

export default Conversations;
