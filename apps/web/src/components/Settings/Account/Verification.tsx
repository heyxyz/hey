import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';
import type { FC } from 'react';
import { verifiedMembers } from 'src/store/non-persisted/useAppStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Verification: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {verifiedMembers().includes(currentProfile?.id) ? (
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
