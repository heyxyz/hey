import { UserAddIcon } from '@heroicons/react/outline';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import type { Community } from '@lenster/types/communities';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

interface JoinOrLeaveProps {
  community: Community;
}

const JoinOrLeave: FC<JoinOrLeaveProps> = ({ community }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchIsMember = async () => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/getIsMember/${community.id}/${currentProfile?.id}`
      );

      setIsMember(response.data?.isMember);
    } catch (error) {
      return [];
    }
  };

  const { isLoading: loading } = useQuery(['communityFoll', community.id], () =>
    fetchIsMember().then((res) => res)
  );

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
      await axios.post(`${COMMUNITIES_WORKER_URL}/community/joinOrLeave`, {
        communityId: community.id,
        profileId: currentProfile.id,
        join: !isMember,
        ...getBasicWorkerPayload()
      });
      setIsMember(!isMember);
      toast.success(
        isMember
          ? t`Successfully left the community`
          : t`Successfully joined the community`
      );
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="shimmer h-[34px] w-28 rounded-lg" />;
  }

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline
      variant={isMember ? 'danger' : 'primary'}
      onClick={joinCommunity}
      aria-label="Join"
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner size="xs" variant={isMember ? 'danger' : 'primary'} />
        ) : (
          <UserAddIcon className="h-4 w-4" />
        )
      }
    >
      {isMember ? t`Leave` : t`Join`}
    </Button>
  );
};

export default JoinOrLeave;
