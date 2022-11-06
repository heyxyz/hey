import { Card } from '@components/UI/Card';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import isVerified from '@lib/isVerified';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const Verification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="space-y-2 linkify p-5">
      <div className="text-lg font-bold">Verified</div>
      {isVerified(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <BadgeCheckIcon className="w-5 h-5 text-brand" />
        </div>
      ) : (
        <div>
          No.{' '}
          <a href="https://tally.so/r/wgDajK" target="_blank" rel="noreferrer noopener">
            Request Verification
          </a>
        </div>
      )}
    </Card>
  );
};

export default Verification;
