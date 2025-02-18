import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  type LoggedInGroupOperations,
  useLeaveGroupMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface LeaveProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ group, setJoined, small }) => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      leaveOn: group.address,
      txHash,
      type: OptimisticTxType.LEAVE_GROUP
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

      return await handleTransactionLifecycle({
        transactionData: leaveGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleLeave = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await leaveGroup({
      variables: { request: { group: group.address } }
    });
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
