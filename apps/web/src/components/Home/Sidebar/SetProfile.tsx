import type { FC } from 'react';

import New from '@components/Shared/Badges/New';
import {
  MinusCircleIcon,
  PencilSquareIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { APP_NAME } from '@hey/data/constants';
import { ONBOARDING } from '@hey/data/tracking';
import { Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface StatusProps {
  finished: boolean;
  title: string;
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="size-5 text-green-500" />
    ) : (
      <MinusCircleIcon className="size-5 text-yellow-500" />
    )}
    <div className={cn(finished ? 'text-green-500' : 'text-yellow-500')}>
      {title}
    </div>
  </div>
);

const SetProfile: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const doneSetup =
    Boolean(currentProfile?.metadata?.displayName) &&
    Boolean(currentProfile?.metadata?.bio) &&
    Boolean(currentProfile?.metadata?.picture) &&
    Boolean(currentProfile?.interests?.length);

  if (doneSetup) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-green-600 !bg-green-50 p-5 text-green-600 dark:bg-green-900"
    >
      <div className="flex items-center space-x-2 font-bold">
        <PhotoIcon className="size-5" />
        <p>Setup your {APP_NAME} profile</p>
      </div>
      <div className="space-y-1 text-sm leading-[22px]">
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
            className="flex items-center space-x-2"
            href="/settings/interests"
            onClick={() =>
              Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_PROFILE_INTERESTS)
            }
          >
            <Status
              finished={Boolean(currentProfile?.interests?.length)}
              title="Select profile interests"
            />
            <New />
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 text-sm font-bold">
        <PencilSquareIcon className="size-4" />
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
