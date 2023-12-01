import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';
import type { FC } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { hydrateVerifiedMembers } from 'src/store/persisted/useVerifiedMembersStore';

const Verification: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { verifiedMembers } = hydrateVerifiedMembers();

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {verifiedMembers.includes(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <CheckBadgeIcon className="text-brand-500 h-5 w-5" />
        </div>
      ) : (
        <div>No.</div>
      )}
    </Card>
  );
};

export default Verification;
