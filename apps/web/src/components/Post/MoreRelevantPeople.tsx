import SingleAccount from "@components/Shared/SingleAccount";
import { AccountLinkSource } from "@hey/data/tracking";
import type { Profile } from "@hey/lens";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MoreRelevantPeopleProps {
  accounts: Profile[];
}

const MoreRelevantPeople: FC<MoreRelevantPeopleProps> = ({ accounts }) => {
  const { currentAccount } = useAccountStore();

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="virtual-account-list"
        computeItemKey={(index, account) => `${account.id}-${index}`}
        // remove the first 5 accounts from the list because they are already shown in the sidebar
        data={accounts.slice(5)}
        itemContent={(_, account) => (
          <div className="p-5">
            <SingleAccount
              hideFollowButton={currentAccount?.id === account.id}
              hideUnfollowButton={currentAccount?.id === account.id}
              account={account as Profile}
              showBio
              showUserPreview={false}
              source={AccountLinkSource.WhoToFollow}
            />
          </div>
        )}
      />
    </div>
  );
};

export default MoreRelevantPeople;
