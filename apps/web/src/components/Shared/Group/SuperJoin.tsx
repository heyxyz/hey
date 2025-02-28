import {
  getMembershipApprovalDetails,
  getSimplePaymentDetails
} from "@helpers/rules";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import getTokenImage from "@hey/helpers/getTokenImage";
import type { Group, GroupRules } from "@hey/indexer";
import { H3, H5 } from "@hey/ui";
import type { FC } from "react";
import { useSuperJoinModalStore } from "src/store/non-persisted/modal/useSuperJoinModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { Address } from "viem";
import { useBalance } from "wagmi";
import FundButton from "../Fund/FundButton";
import Loader from "../Loader";
import Join from "./Join";

const SuperJoin: FC = () => {
  const { currentAccount } = useAccountStore();
  const { superJoiningGroup, setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetContract, assetSymbol, amount } = getSimplePaymentDetails(
    superJoiningGroup?.rules as GroupRules
  );
  const requiresMembershipApproval = getMembershipApprovalDetails(
    superJoiningGroup?.rules as GroupRules
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
    return <Loader message="Loading Super join" className="my-10" />;
  }

  const hasEnoughBalance = balance?.value && balance.value >= (amount || 0);

  return (
    <div className="p-5">
      <div className="space-y-1.5 pb-2">
        <H5>Super Join</H5>
        <div className="ld-text-gray-500">
          Support your favorite group on {APP_NAME}.
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
          <Join
            className="w-full"
            group={superJoiningGroup as Group}
            setJoined={() => setShowSuperJoinModal(false, superJoiningGroup)}
            small={false}
            title={
              requiresMembershipApproval ? "Request to join" : "Super Join"
            }
          />
        ) : (
          <FundButton className="w-full" />
        )}
      </div>
    </div>
  );
};

export default SuperJoin;
