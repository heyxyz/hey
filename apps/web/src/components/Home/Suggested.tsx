import DismissRecommendedAccount from "@components/Shared/DismissRecommendedAccount";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import type { Profile } from "@hey/lens";
import { EmptyState } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface SuggestedProps {
  accounts: Profile[];
}

const Suggested: FC<SuggestedProps> = ({ accounts }) => {
  const { currentAccount } = useAccountStore();

  if (accounts.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message="Nothing to suggest"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="virtual-account-list"
        computeItemKey={(index, account) => `${account.id}-${index}`}
        // remove the first 5 profiles from the list because they are already shown in the sidebar
        data={accounts.slice(5)}
        itemContent={(_, account) => (
          <div className="flex items-center space-x-3 p-5">
            <div className="w-full">
              <SingleAccount
                hideFollowButton={currentAccount?.id === account.id}
                hideUnfollowButton={currentAccount?.id === account.id}
                account={account as Profile}
                showBio
                showUserPreview={false}
                source={AccountLinkSource.WhoToFollow}
              />
            </div>
            <DismissRecommendedAccount account={account as Profile} />
          </div>
        )}
      />
    </div>
  );
};

export default Suggested;
