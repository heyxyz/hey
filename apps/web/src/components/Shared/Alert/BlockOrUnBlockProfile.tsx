import { PROFILE } from '@hey/data/tracking';
import type { BlockRequest, UnblockRequest } from '@hey/lens';
import { useBlockMutation, useUnblockMutation } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import { Alert } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';

const BlockOrUnBlockProfile: FC = () => {
  const { showBlockAlert, setShowBlockAlert, blockingProfile } =
    useGlobalAlertStateStore();
  const isBlockedByMe = blockingProfile?.operations.isBlockedByMe.value;

  const [blockProfile, { loading: blocking }] = useBlockMutation({
    onCompleted: () => {
      setShowBlockAlert(false, null);
      Leafwatch.track(PROFILE.BLOCK, {
        profile_id: blockingProfile?.id
      });
      toast.success('Profile blocked successfully');
    }
  });

  const [unBlockProfile, { loading: unBlocking }] = useUnblockMutation({
    onCompleted: () => {
      setShowBlockAlert(false, null);
      Leafwatch.track(PROFILE.UNBLOCK, {
        profile_id: blockingProfile?.id
      });
      toast.success('Profile un-blocked successfully');
    }
  });

  return (
    <Alert
      title="Block Profile"
      description={`Are you sure you want to ${
        isBlockedByMe ? 'un-block' : 'block'
      } @${formatHandle(blockingProfile?.handle)}?`}
      confirmText="Block"
      show={showBlockAlert}
      isDestructive
      isPerformingAction={blocking || unBlocking}
      onConfirm={async () => {
        const request: BlockRequest | UnblockRequest = {
          profiles: [blockingProfile?.id]
        };

        isBlockedByMe
          ? await unBlockProfile({ variables: { request } })
          : await blockProfile({ variables: { request } });
      }}
      onClose={() => setShowBlockAlert(false, null)}
    />
  );
};

export default BlockOrUnBlockProfile;
