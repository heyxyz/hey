import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import getAnyKeyValue from "@helpers/getAnyKeyValue";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  type GroupRule,
  type GroupRules,
  type LoggedInGroupOperations,
  useJoinGroupMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import type { Address } from "viem";
import { useBalance } from "wagmi";
import FundButton from "../Fund/FundButton";

const getSimplePaymentDetails = (
  rules: GroupRules
): {
  assetContract: string | null;
  assetSymbol: string | null;
  amount: number | null;
} => {
  const searchInArray = (arr: GroupRule[]) => {
    for (const rule of arr) {
      if (rule.type === "SIMPLE_PAYMENT") {
        return {
          assetContract:
            getAnyKeyValue(rule.config, "assetContract")?.address || null,
          assetSymbol:
            getAnyKeyValue(rule.config, "assetSymbol")?.string || null,
          amount:
            Number(getAnyKeyValue(rule.config, "amount")?.bigDecimal) || null
        };
      }
    }

    return { assetContract: null, assetSymbol: null, amount: null };
  };

  return searchInArray(rules.required) || searchInArray(rules.anyOf);
};

interface JoinProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ group, setJoined, small }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const { assetContract, assetSymbol, amount } = getSimplePaymentDetails(
    group.rules
  );
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: currentAccount?.address as Address,
    token: assetContract as Address,
    query: { enabled: !!assetContract, refetchInterval: 2000 }
  });

  const isEnoughBalance = balance?.value && balance.value >= (amount || 0);

  const updateCache = () => {
    cache.modify({
      fields: { isMember: () => true },
      id: cache.identify(group.operations as LoggedInGroupOperations)
    });
  };

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.JOIN_GROUP);
    updateCache();
    setIsLoading(false);
    setJoined(true);
    toast.success("Joined group");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      if (joinGroup.__typename === "JoinGroupResponse") {
        return onCompleted(joinGroup.hash);
      }

      if (joinGroup.__typename === "GroupOperationValidationFailed") {
        return onError({ message: joinGroup.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleJoin = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await joinGroup({
      variables: { request: { group: group.address } }
    });
  };

  if (balanceLoading) {
    return <div className="shimmer h-[34px] w-20 rounded-full" />;
  }

  if (!isEnoughBalance) {
    return (
      <FundButton label={`Fund ${amount?.toFixed(2)} ${assetSymbol} to Join`} />
    );
  }

  return (
    <Button
      aria-label="Join"
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      {assetContract ? `Join for ${amount?.toFixed(2)} ${assetSymbol}` : "Join"}
    </Button>
  );
};

export default Join;
