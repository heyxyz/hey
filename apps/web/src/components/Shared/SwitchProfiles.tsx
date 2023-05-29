import { UserAddIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import { IS_MAINNET } from 'data';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE } from 'src/tracking';
import { Image } from 'ui';

const SwitchProfiles: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.setShowProfileSwitchModal
  );

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      {profiles.map((profile: Profile, index) => (
        <button
          key={profile?.id}
          type="button"
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => {
            const selectedProfile = profiles[index];
            setCurrentProfile(selectedProfile);
            setProfileId(selectedProfile.id);
            setShowProfileSwitchModal(false);
            Leafwatch.track(PROFILE.SWITCH_PROFILE, {
              switch_profile_to: selectedProfile.id
            });
          }}
        >
          <span className="flex items-center space-x-2">
            <Image
              className="h-6 w-6 rounded-full border dark:border-gray-700"
              height={20}
              width={20}
              src={getAvatar(profile)}
              alt={formatHandle(profile?.handle)}
            />
            <div className="truncate">{formatHandle(profile?.handle)}</div>
          </span>
          {currentProfile?.id === profile?.id && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
        </button>
      ))}
      {!IS_MAINNET && (
        <Link
          href="/new/profile"
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => setShowProfileSwitchModal(false)}
        >
          <span className="flex items-center space-x-2">
            <div className="dark:border-brand-700 border-brand-400 bg-brand-500/20 flex h-6 w-6 items-center justify-center rounded-full border">
              <UserAddIcon className="text-brand h-3 w-3" />
            </div>
            <div>
              <Trans>Create Profile</Trans>
            </div>
          </span>
        </Link>
      )}
    </div>
  );
};

export default SwitchProfiles;
