import type { Preferences } from '@hey/types/hey';
import type { FC } from 'react';

import MetaDetails from '@components/Shared/MetaDetails';
import {
  BellIcon,
  CursorArrowRaysIcon,
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  Cog6ToothIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { H5 } from '@hey/ui';

interface ProfilePreferencesProps {
  preferences: Preferences;
}

const ProfilePreferences: FC<ProfilePreferencesProps> = ({ preferences }) => {
  if (!preferences) {
    return null;
  }

  return (
    <>
      <div className="divider my-5 border-dashed border-yellow-600" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <Cog6ToothIcon className="size-5" />
        <H5>Profile Preferences</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<EnvelopeIcon className="ld-text-gray-500 size-4" />}
          title="Email"
          value={preferences.email || 'Not set'}
        >
          <div className="flex items-center space-x-1">
            <div>{preferences.email || 'Not set'}</div>
            {preferences.emailVerified ? (
              <CheckCircleIcon className="size-4 text-green-500" />
            ) : null}
          </div>
        </MetaDetails>
        <MetaDetails
          icon={<CursorArrowRaysIcon className="ld-text-gray-500 size-4" />}
          title="App Icon"
        >
          <img
            className="size-4"
            height={16}
            src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
            width={16}
          />
        </MetaDetails>
        <MetaDetails
          icon={<SparklesIcon className="ld-text-gray-500 size-4" />}
          title="Dismissed or minted membership NFT"
        >
          {preferences.hasDismissedOrMintedMembershipNft ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<BellIcon className="ld-text-gray-500 size-4" />}
          title="High signal notification filter"
        >
          {preferences.highSignalNotificationFilter ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
      </div>
    </>
  );
};

export default ProfilePreferences;
