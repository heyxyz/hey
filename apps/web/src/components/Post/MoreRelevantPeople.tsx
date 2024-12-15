import SingleAccount from "@components/Shared/SingleAccount";
import type { Account } from "@hey/indexer";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MoreRelevantPeopleProps {
  accounts: Account[];
}

const MoreRelevantPeople: FC<MoreRelevantPeopleProps> = ({ accounts }) => {
  const { currentAccount } = useAccountStore();

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="virtual-account-list"
        computeItemKey={(index, account) => `${account.address}-${index}`}
        // remove the first 5 accounts from the list because they are already shown in the sidebar
        data={accounts.slice(5)}
        itemContent={(_, account) => (
          <div className="p-5">
            <SingleAccount
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
              account={account as Account}
              showBio
              showUserPreview={false}
            />
          </div>
        )}
      />
    </div>
  );
};

export default MoreRelevantPeople;
