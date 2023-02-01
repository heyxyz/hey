import { Card } from '@components/UI/Card';
import { CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const SetDefaultProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const hasDefaultProfile = Boolean(profiles.find((o) => o.isDefault));
  const count = profiles.length;

  if (currentProfile || hasDefaultProfile) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-2.5 !border-green-600 bg-green-50 p-5 text-green-600 dark:bg-green-900"
    >
      <div className="flex items-center space-x-2 font-bold">
        <UserCircleIcon className="h-5 w-5" />
        <p>
          <Trans>Set default profile</Trans>
        </p>
      </div>
      <p className="text-sm leading-[22px]">
        <Trans>
          You own {count} {count === 1 ? 'profile' : 'profiles'} but you don't have a default one.
        </Trans>
      </p>
      <div className="flex items-center space-x-1.5 text-sm font-bold">
        <CurrencyDollarIcon className="h-4 w-4" />
        <Link href="/settings/account">
          <Trans>Set default profile here</Trans>
        </Link>
      </div>
    </Card>
  );
};

export default SetDefaultProfile;
