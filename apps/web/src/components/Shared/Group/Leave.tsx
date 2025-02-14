import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { Group, LoggedInGroupOperations, useLeaveGroupMutation } from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface LeaveProps {
  group: Group
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ group, setJoined, small }) => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);

  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      leaveOn: group.address,
      txHash,
      type: OptmisticTransactionType.LeaveGroup
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isMember: () => false },
      id: cache.identify(group.operations as LoggedInGroupOperations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    setJoined(false);
    toast.success("Left group");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [leaveGroup] = useLeaveGroupMutation({
    onCompleted: async ({ leaveGroup }) => {
      if (leaveGroup.__typename === "LeaveGroupResponse") {
        return onCompleted(leaveGroup.hash);
      }

      if (walletClient) {
        try {
          if (leaveGroup.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(leaveGroup.raw)
            });

            return onCompleted(hash);
          }

          if (leaveGroup.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(leaveGroup.raw)
            });

            return onCompleted(hash);
          }

          if (leaveGroup.__typename === "TransactionWillFail") {
            return toast.error(leaveGroup.reason);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (leaveGroup.__typename === "TransactionWillFail") {
        return toast.error(leaveGroup.reason);
      }
    },
    onError
  });

  const handleLeave = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await leaveGroup({ variables: { request: { group: group.address } } });
  };

  return (
    <Button
      aria-label="Leave"
      disabled={isLoading}
      onClick={handleLeave}
      size={small ? "sm" : "md"}
    >
      Leave
    </Button>
  );
};

export default Leave;
