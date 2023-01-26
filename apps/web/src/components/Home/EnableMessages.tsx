import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { MailIcon, MailOpenIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Client } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import { XMTP_ENV } from 'data/constants';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';

const EnableMessages: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { push } = useRouter();
  const [canMessage, setCanMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConversationSelected = () => {
    push('/messages');
  };

  useEffect(() => {
    const fetchCanMessage = async () => {
      setLoading(true);
      const isMessagesEnabled = await Client.canMessage(currentProfile?.ownedBy, { env: XMTP_ENV });
      setCanMessage(isMessagesEnabled);
      setLoading(false);
    };
    fetchCanMessage();
  }, [currentProfile]);

  if (!currentProfile || loading || canMessage) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 border-green-400 !bg-green-300 !bg-opacity-20 space-y-2.5 text-green-600 p-5"
    >
      <div className="flex items-center space-x-2 font-bold">
        <MailOpenIcon className="w-5 h-5" />
        <p>
          <Trans>Direct messages are here!</Trans>
        </p>
      </div>
      <p className="text-sm leading-[22px] mr-10">
        <Trans>Activate XMTP to start using Lenster to send end-to-end encrypted DMs to frens.</Trans>
      </p>
      <Button
        className={clsx({ 'text-sm': true }, `mr-auto`)}
        icon={<MailIcon className="w-4 h-4" />}
        onClick={onConversationSelected}
      >
        <Trans>Enable DMs</Trans>
      </Button>
    </Card>
  );
};

export default EnableMessages;
