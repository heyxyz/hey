import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { Leafwatch } from "@helpers/leafwatch";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource, SEARCH } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import { useProfilesQuery } from "@hey/lens";
import { H6 } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useSearchStore } from "src/store/persisted/useSearchStore";

interface RecentAccountsProps {
  onAccountClick: () => void;
}

const RecentAccounts: FC<RecentAccountsProps> = ({ onAccountClick }) => {
  const { push } = useRouter();
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
          <div className="flex items-center justify-between px-4 pt-1 pb-2">
            <b>Recent</b>
            <button
              onClick={() => {
                clearProfiles();
                Leafwatch.track(SEARCH.CLEAR_ALL_RECENT_SEARCH);
              }}
              type="button"
            >
              <H6 className="ld-text-gray-500">Clear all</H6>
            </button>
          </div>
          {profiles.map((profile) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={profile.id}
              onClick={() => {
                addToRecentProfiles(profile.id);
                push(getAccount(profile as Profile).link);
                onAccountClick();
              }}
            >
              <div className="w-full">
                <SingleAccount
                  hideFollowButton
                  hideUnfollowButton
                  linkToAccount={false}
                  account={profile as Profile}
                  showUserPreview={false}
                  source={AccountLinkSource.RecentSearch}
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

export default RecentAccounts;
