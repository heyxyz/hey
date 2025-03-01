import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { XMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { useAccountsBulkQuery } from "@hey/indexer";
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
    addAccount,
    clearAccount,
    clearAccounts,
    accounts: recentAccounts
  } = useSearchStore();

  const { data, loading } = useAccountsBulkQuery({
    skip: recentAccounts.length === 0,
    variables: { request: { addresses: recentAccounts } }
  });

  if (recentAccounts.length === 0) {
    return null;
  }

  const accounts = data?.accountsBulk || [];

  return (
    <div>
      {loading ? (
        <Loader className="my-3" message="Loading recent profiles" small />
      ) : (
        <div>
          <div className="flex items-center justify-between px-4 pt-1 pb-2">
            <b>Recent</b>
            <button onClick={clearAccounts} type="button">
              <H6 className="ld-text-gray-500">Clear all</H6>
            </button>
          </div>
          {accounts.map((account) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={account.address}
              onClick={() => {
                addAccount(account.address);
                push(getAccount(account).link);
                onAccountClick();
              }}
            >
              <div className="w-full">
                <SingleAccount
                  hideFollowButton
                  hideUnfollowButton
                  linkToAccount={false}
                  account={account}
                  showUserPreview={false}
                />
              </div>
              <button
                onClick={(event) => {
                  stopEventPropagation(event);
                  clearAccount(account.address);
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
