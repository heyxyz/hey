import { CheckCircleIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import type { Profile } from 'lens';
import type { FC } from 'react';
import React from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE } from 'src/tracking';

const SwitchProfiles: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

  return (
    <div className="py-2 max-h-[80vh] overflow-y-auto">
      {profiles.map((profile: Profile, index) => (
        <div key={profile?.id} className="text-gray-700 px-2 rounded-lg cursor-pointer dark:text-gray-200">
          <button
            type="button"
            className="flex items-center py-1.5 px-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              const selectedProfile = profiles[index];
              setCurrentProfile(selectedProfile);
              setProfileId(selectedProfile.id);
              Analytics.track(PROFILE.SWITCH_PROFILE);
              setShowProfileSwitchModal(false);
            }}
          >
            {currentProfile?.id === profile?.id && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
            <img
              className="w-5 h-5 rounded-full border dark:border-gray-700"
              height={20}
              width={20}
              onError={({ currentTarget }) => {
                currentTarget.src = getAvatar(profile, false);
              }}
              src={getAvatar(profile)}
              alt={formatHandle(profile?.handle)}
            />
            <div className="truncate">{formatHandle(profile?.handle)}</div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SwitchProfiles;
