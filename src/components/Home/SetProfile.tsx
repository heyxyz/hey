import { Card } from '@components/UI/Card';
import { MinusCircleIcon, PencilAltIcon, PhotographIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { BirdStats } from '@lib/birdstats';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { APP_NAME } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { MISCELLANEOUS } from 'src/tracking';

interface StatusProps {
  finished: boolean;
  title: string;
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <MinusCircleIcon className="w-5 h-5 text-yellow-500" />
    )}
    <div className={clsx(finished ? 'text-green-500' : 'text-yellow-500')}>{title}</div>
  </div>
);

const SetProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const hasDefaultProfile = !!profiles.find((o) => o.isDefault);
  const doneSetup = !!currentProfile?.name && !!currentProfile?.bio && !!currentProfile?.picture;

  if (!hasDefaultProfile || doneSetup) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 bg-green-50 dark:bg-green-900 !border-green-600 space-y-4 text-green-600 p-5"
    >
      <div className="flex items-center space-x-2 font-bold">
        <PhotographIcon className="w-5 h-5" />
        <p>Setup your {APP_NAME} profile</p>
      </div>
      <div className="space-y-1 text-sm leading-[22px]">
        <Status finished={!!currentProfile?.name} title="Set profile name" />
        <Status finished={!!currentProfile?.bio} title="Set profile bio" />
        <Status finished={!!currentProfile?.picture} title="Set your avatar" />
      </div>
      <div className="flex items-center space-x-1.5 text-sm font-bold">
        <PencilAltIcon className="w-4 h-4" />
        <Link href="/settings" onClick={() => BirdStats.track(MISCELLANEOUS.NAVIGATE_UPDATE_PROFILE)}>
          Update profile here
        </Link>
      </div>
    </Card>
  );
};

export default SetProfile;
