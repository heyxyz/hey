import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CHANNELS_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { PROFILE } from '@lenster/data/tracking';
import type { Channel } from '@lenster/types/lenster';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { useRouter } from 'next/router';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

interface JoinProps {
  channel: Channel;
}

const Join: FC<JoinProps> = ({ channel }) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);

  const createMembership = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${CHANNELS_WORKER_URL}/joinOrLeave`,
        { profileId: currentProfile?.id, channelId: channel?.id },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
          }
        }
      );
      toast.success(t`Joined successfully!`);
      Leafwatch.track(PROFILE.FOLLOW, {
        path: pathname,
        profile_id: currentProfile?.id,
        channel_id: channel?.id
      });
    } catch (error) {
      setIsLoading(false);
      errorToast(error);
    }
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      onClick={createMembership}
      aria-label="Join"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <UserPlusIcon className="h-4 w-4" />
      }
      outline
    >
      <Trans>Join</Trans>
    </Button>
  );
};

export default Join;
