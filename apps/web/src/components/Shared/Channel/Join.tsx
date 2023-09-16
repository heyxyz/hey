import { useChannelMemberCountStore } from '@components/Channel/Details';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CHANNELS_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { PROFILE } from '@lenster/data/tracking';
import type { Channel } from '@lenster/types/lenster';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
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
  const { membersCount, setMembersCount } = useChannelMemberCountStore();
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isChannelMember = async () => {
    try {
      const response = await axios.get(`${CHANNELS_WORKER_URL}/isMember`, {
        params: {
          profileId: currentProfile?.id,
          channelId: channel.id
        }
      });
      const { data } = response;
      setJoined(data.isMember);
    } catch {}
  };

  const { isLoading } = useQuery(
    ['isChannelMember', channel.id, currentProfile?.id],
    () => isChannelMember()
  );

  const createMembership = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `${CHANNELS_WORKER_URL}/joinOrLeave`,
        { profileId: currentProfile?.id, channelId: channel?.id },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
          }
        }
      );
      setJoined(!joined);
      setMembersCount(joined ? membersCount - 1 : membersCount + 1);
      toast.success(joined ? t`Left successfully!` : t`Joined successfully!`);
      Leafwatch.track(PROFILE.FOLLOW, {
        path: pathname,
        profile_id: currentProfile?.id,
        channel_id: channel?.id
      });
    } catch (error) {
      setSubmitting(false);
      errorToast(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      onClick={createMembership}
      aria-label="Join"
      disabled={submitting || isLoading}
      icon={
        submitting ? (
          <Spinner size="xs" />
        ) : (
          <UserPlusIcon className="h-4 w-4" />
        )
      }
      outline
    >
      {isLoading ? t`Loading...` : joined ? t`Leave` : t`Join`}
    </Button>
  );
};

export default Join;
