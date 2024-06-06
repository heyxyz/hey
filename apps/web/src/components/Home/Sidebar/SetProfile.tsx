import type { FC } from 'react';

import { APP_NAME } from '@good/data/constants';
import { ONBOARDING } from '@good/data/tracking';
import { Card } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface StatusProps {
  finished: boolean;
  title: string;
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="size-5" />
    ) : (
      <MinusCircleIcon className="size-5" />
    )}
    <div className="ld-text-gray-500">{title}</div>
  </div>
);

const SetProfile: FC = () => {
  const { currentProfile } = useProfileStore();

  const doneSetup =
    Boolean(currentProfile?.metadata?.displayName) &&
    Boolean(currentProfile?.metadata?.bio) &&
    Boolean(currentProfile?.metadata?.picture) &&
    Boolean(currentProfile?.interests?.length);

  if (doneSetup) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <p className="text-lg font-semibold">Setup your {APP_NAME} profile</p>
      <div className="space-y-1 text-sm leading-5">
        <Status
          finished={Boolean(currentProfile?.metadata?.displayName)}
          title="Set profile name"
        />
        <Status
          finished={Boolean(currentProfile?.metadata?.bio)}
          title="Set profile bio"
        />
        <Status
          finished={Boolean(currentProfile?.metadata?.picture)}
          title="Set your avatar"
        />
        <div>
          <Link
            href="/settings/interests"
            onClick={() =>
              Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_PROFILE_INTERESTS)
            }
          >
            <Status
              finished={Boolean(currentProfile?.interests?.length)}
              title="Select profile interests"
            />
          </Link>
        </div>
      </div>
      <div className="font-bold">
        <Link
          href="/settings"
          onClick={() => Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_PROFILE)}
        >
          Update profile now
        </Link>
      </div>
    </Card>
  );
};

export default SetProfile;
