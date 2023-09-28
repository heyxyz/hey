import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CHANNELS_WORKER_URL } from '@hey/data/constants';
import type { Channel } from '@hey/types/lenster';
import { Button, Modal } from '@hey/ui';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import { useAppStore } from 'src/store/app';

import Mint from './Mint';

interface JoinProps {
  channel: Channel;
}

const Join: FC<JoinProps> = ({ channel }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMintModal, setShowMintModal] = useState(false);
  const [joined, setJoined] = useState(false);

  const isChannelMember = async () => {
    try {
      const response = await axios.get(`${CHANNELS_WORKER_URL}/isMember`, {
        params: { by: currentProfile?.ownedBy, contract: channel.contract }
      });
      const { data } = response;
      setJoined(data.isMember);
    } catch {}
  };

  const { isLoading } = useQuery(
    ['isChannelMember', channel.contract, currentProfile?.ownedBy],
    () => isChannelMember(),
    { enabled: Boolean(currentProfile) }
  );

  if (!currentProfile) {
    return null;
  }

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        onClick={() => setShowMintModal(true)}
        aria-label="Join"
        disabled={isLoading}
        icon={<UserPlusIcon className="h-4 w-4" />}
        outline
      >
        {isLoading ? t`Loading...` : joined ? t`Joined` : t`Join`}
      </Button>
      <Modal
        show={showMintModal}
        title={t`Join Channel`}
        icon={<UserPlusIcon className="text-brand h-5 w-5" />}
        onClose={() => setShowMintModal(false)}
      >
        <Mint channel={channel} joined={joined} />
      </Modal>
    </>
  );
};

export default Join;
