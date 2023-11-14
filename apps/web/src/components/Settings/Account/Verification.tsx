import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { FeatureFlag } from '@hey/data/feature-flags';
import { Card } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { FC } from 'react';

const Verification: FC = () => {
  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {isFeatureEnabled(FeatureFlag.Verified) ? (
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
