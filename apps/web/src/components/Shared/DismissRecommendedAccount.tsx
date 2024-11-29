import { Leafwatch } from "@helpers/leafwatch";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ACCOUNT } from "@hey/data/tracking";
import type { Account } from "@hey/indexer";
import { useDismissRecommendedProfilesMutation } from "@hey/lens";
import type { FC } from "react";

interface DismissRecommendedAccountProps {
  account: Account;
}

const DismissRecommendedAccount: FC<DismissRecommendedAccountProps> = ({
  account
}) => {
  const [dismissRecommendedAccount] = useDismissRecommendedProfilesMutation({
    update: (cache) => {
      cache.evict({ id: cache.identify(account) });
    },
    variables: { request: { dismiss: [account.address] } }
  });

  const handleDismiss = async () => {
    await dismissRecommendedAccount();
    Leafwatch.track(ACCOUNT.DISMISS_RECOMMENDED_ACCOUNT, {
      address: account.address
    });
  };

  return (
    <button onClick={handleDismiss} type="reset">
      <XMarkIcon className="size-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedAccount;
