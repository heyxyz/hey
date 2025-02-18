import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  type LoggedInGroupOperations,
  useJoinGroupMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface JoinProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ group, setJoined, small }) => {
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
      joinOn: group.address,
      txHash,
      type: OptimisticTxType.JOIN_GROUP
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isMember: () => true },
      id: cache.identify(group.operations as LoggedInGroupOperations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
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

  return (
    <Button
      aria-label="Join"
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      Join
    </Button>
  );
};

export default Join;
