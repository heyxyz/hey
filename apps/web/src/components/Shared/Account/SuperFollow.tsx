import { getSimplePaymentDetails } from "@helpers/group";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { Account, AccountFollowRules } from "@hey/indexer";
import type { FC } from "react";
import { useSuperFollowModalStore } from "src/store/non-persisted/modal/useSuperFollowModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { Address } from "viem";
import { useBalance } from "wagmi";
import FundButton from "../Fund/FundButton";
import Loader from "../Loader";
import Follow from "./Follow";

const SuperFollow: FC = () => {
  const { currentAccount } = useAccountStore();
  const { superFollowingAccount, setShowSuperFollowModal } =
    useSuperFollowModalStore();
  const { assetContract, assetSymbol, amount } = getSimplePaymentDetails(
    superFollowingAccount?.rules as AccountFollowRules
  );
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: currentAccount?.address as Address,
    token: assetContract as Address,
    query: { enabled: !!assetContract, refetchInterval: 2000 }
  });

  if (balanceLoading) {
    return <Loader message="Loading balance..." className="my-10" />;
  }

  const hasEnoughBalance = balance?.value && balance.value >= (amount || 0);

  return (
    <div className="m-5 space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="ld-text-gray-500 flex items-center gap-2 text-sm">
            {hasEnoughBalance ? (
              <CheckCircleIcon className="size-4 text-green-500" />
            ) : (
              <XCircleIcon className="size-4 text-red-500" />
            )}
            <span>
              You need to pay{" "}
              <b>
                {amount} {assetSymbol}
              </b>{" "}
              to follow this account.
            </span>
          </div>
        </div>
        {hasEnoughBalance ? (
          <Follow
            account={superFollowingAccount as Account}
            buttonClassName=""
            small={false}
            title="Super Follow"
            onFollow={() =>
              setShowSuperFollowModal(false, superFollowingAccount)
            }
          />
        ) : (
          <FundButton />
        )}
      </div>
    </div>
  );
};

export default SuperFollow;
