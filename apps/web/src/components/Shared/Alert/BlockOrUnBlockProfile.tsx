import { PROFILE } from '@hey/data/tracking';
import type { BlockRequest, UnblockRequest } from '@hey/lens';
import { useBlockMutation, useUnblockMutation } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Alert } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';

const BlockOrUnBlockProfile: FC = () => {
  const {
    showBlockOrUnblockAlert,
    setShowBlockOrUnblockAlert,
    blockingorUnblockingProfile
  } = useGlobalAlertStateStore();
  const isBlockedByMe =
    blockingorUnblockingProfile?.operations.isBlockedByMe.value;

  const [blockProfile, { loading: blocking }] = useBlockMutation({
    onCompleted: () => {
      setShowBlockOrUnblockAlert(false, null);
      Leafwatch.track(PROFILE.BLOCK, {
        profile_id: blockingorUnblockingProfile?.id
      });
      toast.success('Profile blocked successfully!');
    }
  });

  const [unBlockProfile, { loading: unBlocking }] = useUnblockMutation({
    onCompleted: () => {
      setShowBlockOrUnblockAlert(false, null);
      Leafwatch.track(PROFILE.UNBLOCK, {
        profile_id: blockingorUnblockingProfile?.id
      });
      toast.success('Profile un-blocked successfully');
    }
  });

  return (
    <Alert
      title="Block Profile"
      description={`Are you sure you want to ${
        isBlockedByMe ? 'un-block' : 'block'
      } ${getProfile(blockingorUnblockingProfile).slugWithPrefix}?`}
      confirmText={isBlockedByMe ? 'Unblock' : 'Block'}
      show={showBlockOrUnblockAlert}
      isDestructive
      isPerformingAction={blocking || unBlocking}
      onConfirm={async () => {
        const request: BlockRequest | UnblockRequest = {
          profiles: [blockingorUnblockingProfile?.id]
        };

        isBlockedByMe
          ? await unBlockProfile({ variables: { request } })
          : await blockProfile({ variables: { request } });
      }}
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
    />
  );
};

export default BlockOrUnBlockProfile;
