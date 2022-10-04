import { Button } from '@components/UI/Button';
import { Profile } from '@generated/types';
import { Client } from '@xmtp/xmtp-js';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useXmtpStore } from 'src/store/xmtp';
import { useAccount, useSigner } from 'wagmi';

interface Props {
  profile: Profile;
}

const Message: FC<Props> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount();
  const xmtpState = useXmtpStore((state) => state);
  const { client, setClient, conversations, setConversations, messages, setMessages, setLoading } = xmtpState;

  const sendGm = async () => {
    if (!currentProfile || isError || !signer) {
      toast.error(SIGN_WALLET);
      return;
    }

    // TODO(elise): Swap this out with opening the inbox. This is just a prototype.
    try {
      const message = await client?.sendMessage(profile.ownedBy, 'gm');
      toast.success(`Messaged successfully! ${message?.content}`);
    } catch (error) {
      toast.error('Error sending message');
    }
  };

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

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={sendGm}
      variant="success"
      aria-label="Message"
      disabled={isLoading}
    >
      Message
    </Button>
  );
};

export default Message;
