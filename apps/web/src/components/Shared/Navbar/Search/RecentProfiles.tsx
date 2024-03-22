import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource, SEARCH } from '@hey/data/tracking';
import { useProfilesQuery } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { useSearchStore } from 'src/store/persisted/useSearchStore';

interface RecentProfilesProps {
  onProfileClick: () => void;
}

const RecentProfiles: FC<RecentProfilesProps> = ({ onProfileClick }) => {
  const {
    addProfile: addToRecentProfiles,
    clearProfile,
    clearProfiles,
    profiles: recentProfiles
  } = useSearchStore();

  const { data, loading } = useProfilesQuery({
    skip: recentProfiles.length === 0,
    variables: { request: { where: { profileIds: recentProfiles } } }
  });

  if (recentProfiles.length === 0) {
    return null;
  }

  const profiles = data?.profiles?.items || [];

  return (
    <div>
      {loading ? (
        <Loader className="my-3" message="Loading recent profiles" small />
      ) : (
        <div>
          <div className="flex items-center justify-between px-4 pb-2 pt-1">
            <b>Recent</b>
            <button
              className="ld-text-gray-500 text-sm font-bold"
              onClick={() => {
                clearProfiles();
                Leafwatch.track(SEARCH.CLEAR_ALL_RECENT_SEARCH);
              }}
            >
              Clear all
            </button>
          </div>
          {profiles.map((profile) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={profile.id}
              onClick={() => {
                addToRecentProfiles(profile.id);
                onProfileClick();
              }}
            >
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  showUserPreview={false}
                  source={ProfileLinkSource.RecentSearch}
                />
              </div>
              <button
                onClick={(event) => {
                  stopEventPropagation(event);
                  clearProfile(profile.id);
                }}
                type="reset"
              >
                <XMarkIcon className="size-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="divider my-2" />
    </div>
  );
};

export default RecentProfiles;
