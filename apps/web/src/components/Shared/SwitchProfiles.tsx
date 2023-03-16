import { Image } from '@components/UI/Image';
import { CheckCircleIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import { Mixpanel } from '@lib/mixpanel';
import type { Profile } from 'lens';
import type { FC } from 'react';
import React from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE } from 'src/tracking';
import formatHandle from 'utils/formatHandle';

const SwitchProfiles: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

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
            Mixpanel.track(PROFILE.SWITCH_PROFILE, {
              switch_profile_to: selectedProfile.id
            });
          }}
        >
          <span className="flex items-center space-x-2">
            <Image
              className="h-6 w-6 rounded-full border dark:border-gray-700"
              height={20}
              width={20}
              onError={({ currentTarget }) => {
                currentTarget.src = getAvatar(profile, false);
              }}
              src={getAvatar(profile)}
              alt={formatHandle(profile?.handle)}
            />
            <div className="truncate">{formatHandle(profile?.handle)}</div>
          </span>
          {currentProfile?.id === profile?.id && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
        </button>
      ))}
    </div>
  );
};

export default SwitchProfiles;
