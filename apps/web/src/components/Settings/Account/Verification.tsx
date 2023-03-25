import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import isVerified from 'lib/isVerified';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { Card } from 'ui';

const Verification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="text-lg font-bold">
        <Trans>Verified</Trans>
      </div>
      {isVerified(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <BadgeCheckIcon className="text-brand h-5 w-5" />
        </div>
      ) : (
        <div>
          <Trans>No.</Trans>{' '}
          <a href="https://tally.so/r/wgDajK" target="_blank" rel="noreferrer noopener">
            <Trans>Request Verification</Trans>
          </a>
        </div>
      )}
    </Card>
  );
};

export default Verification;
