import { getSimplePaymentDetails } from "@helpers/rules";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import getAccount from "@hey/helpers/getAccount";
import getTokenImage from "@hey/helpers/getTokenImage";
import type { AccountFollowRules, AccountFragment } from "@hey/indexer";
import { H3, H5 } from "@hey/ui";
import type { FC } from "react";
import { useSuperFollowModalStore } from "src/store/non-persisted/modal/useSuperFollowModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { Address } from "viem";
import { useBalance } from "wagmi";
import FundButton from "../Fund/FundButton";
import Loader from "../Loader";
import Slug from "../Slug";
import Follow from "./Follow";

const SuperFollow: FC = () => {
  const { currentAccount } = useAccountStore();
  const { superFollowingAccount, setShowSuperFollowModal } =
    useSuperFollowModalStore();
  const { assetContract, assetSymbol, amount } = getSimplePaymentDetails(
    superFollowingAccount?.rules as AccountFollowRules
  );
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(assetSymbol || "");

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: currentAccount?.address as Address,
    token: assetContract as Address,
    query: { enabled: !!assetContract, refetchInterval: 2000 }
  });

  if (!assetContract || !assetSymbol || !amount) {
    return null;
  }

  if (balanceLoading) {
    return <Loader message="Loading Super follow" className="my-10" />;
  }

  const hasEnoughBalance = balance?.value && balance.value >= (amount || 0);

  return (
    <div className="p-5">
      <div className="space-y-1.5 pb-2">
        <H5>
          Pay to follow{" "}
          <Slug slug={getAccount(superFollowingAccount).usernameWithPrefix} />
        </H5>
        <div className="ld-text-gray-500">
          Support your favorite people on {APP_NAME}.
        </div>
      </div>
      <div className="flex items-center space-x-1.5 py-2">
        {isTokenEnabled ? (
          <img
            alt={assetSymbol}
            className="size-7"
            height={28}
            src={getTokenImage(assetSymbol)}
            title={assetSymbol}
            width={28}
          />
        ) : (
          <CurrencyDollarIcon className="size-7" />
        )}
        <span className="space-x-1">
          <H3 as="span">{amount}</H3>
          <span className="text-xs">{assetSymbol}</span>
        </span>
      </div>
      <div className="mt-5">
        {hasEnoughBalance ? (
          <Follow
            account={superFollowingAccount as AccountFragment}
            buttonClassName="w-full"
            small={false}
            title="Super Follow"
            onFollow={() =>
              setShowSuperFollowModal(false, superFollowingAccount)
            }
          />
        ) : (
          <FundButton className="w-full" />
        )}
      </div>
    </div>
  );
};

export default SuperFollow;
