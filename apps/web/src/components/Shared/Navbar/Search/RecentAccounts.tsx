import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { type Account, useAccountsQuery } from "@hey/indexer";
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

  const { data, loading } = useAccountsQuery({
    skip: recentProfiles.length === 0,
    variables: { request: { addresses: recentProfiles } }
  });

  if (recentProfiles.length === 0) {
    return null;
  }

  const accounts = data?.accounts || [];

  return (
    <div>
      {loading ? (
        <Loader className="my-3" message="Loading recent profiles" small />
      ) : (
        <div>
          <div className="flex items-center justify-between px-4 pt-1 pb-2">
            <b>Recent</b>
            <button onClick={clearProfiles} type="button">
              <H6 className="ld-text-gray-500">Clear all</H6>
            </button>
          </div>
          {accounts.map((account) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={account.address}
              onClick={() => {
                addToRecentProfiles(account.address);
                push(getAccount(account as Account).link);
                onAccountClick();
              }}
            >
              <div className="w-full">
                <SingleAccount
                  hideFollowButton
                  hideUnfollowButton
                  linkToAccount={false}
                  account={account as Account}
                  showUserPreview={false}
                  source={AccountLinkSource.RecentSearch}
                />
              </div>
              <button
                onClick={(event) => {
                  stopEventPropagation(event);
                  clearProfile(account.address);
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
