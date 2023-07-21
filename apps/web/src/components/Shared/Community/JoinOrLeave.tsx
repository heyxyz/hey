import { UserAddIcon } from '@heroicons/react/outline';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import type { Community } from '@lenster/types/communities';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Trans } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

interface JoinProps {
  community: Community;
}

const JoinOrLeave: FC<JoinProps> = ({ community }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const joinCommunity = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${COMMUNITIES_WORKER_URL}/joinOrLeave`, {
        communityId: community.id,
        profileId: currentProfile.id,
        accessToken: localStorage.getItem('accessToken')
      });
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline
      onClick={joinCommunity}
      aria-label="Join"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <UserAddIcon className="h-4 w-4" />
      }
    >
      <Trans>Join</Trans>
    </Button>
  );
};

export default JoinOrLeave;
