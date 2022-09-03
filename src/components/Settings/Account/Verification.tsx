import { Card, CardBody } from '@components/UI/Card';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Hog } from '@lib/hog';
import isVerified from '@lib/isVerified';
import React, { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';

const Verification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="text-lg font-bold">Verified</div>
        {isVerified(currentProfile?.id) ? (
          <div className="flex items-center space-x-1.5">
            <span>Believe it. Yes, you're really verified.</span>
            <BadgeCheckIcon className="w-5 h-5 text-brand" />
          </div>
        ) : (
          <div>
            No.{' '}
            <a
              href="https://tally.so/r/wgDajK"
              onClick={() => {
                Hog.track(SETTINGS.ACCOUNT.OPEN_VERIFICATION);
              }}
              target="_blank"
              rel="noreferrer noopener"
            >
              Request Verification
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Verification;
