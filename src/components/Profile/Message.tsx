import { Button } from '@components/UI/Button';
import type { Profile } from '@generated/types';
import { MailIcon } from '@heroicons/react/outline';
import buildConversationId from '@lib/buildConversationId';
import { Client } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useSigner } from 'wagmi';

interface Props {
  profile: Profile;
}

const Message: FC<Props> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer, isError, isLoading } = useSigner();

  const sendGm = async () => {
    if (!currentProfile || isError || !signer) {
      toast.error(SIGN_WALLET);
      return;
    }

    try {
      const client = await Client.create(signer);
      const conversation = await client.conversations.newConversation(profile.ownedBy, {
        conversationId: buildConversationId(currentProfile.id, profile.id),
        metadata: {}
      });
      const message = await conversation.send('gm');
      toast.success(`Messaged successfully! ${message.content}`);
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      icon={<MailIcon className="h-5 w-5" />}
      outline
      onClick={sendGm}
      variant="success"
      aria-label="Message"
      disabled={isLoading}
    />
  );
};

export default Message;
