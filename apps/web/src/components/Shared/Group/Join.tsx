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
import { useJoinGroupModalStore } from "src/store/non-persisted/modal/useJoinGroupModalStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface JoinProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ group, setJoined, small }) => {
  const { isSuspended } = useAccountStatus();
  const { setShowJoinGroupModal } = useJoinGroupModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();
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

  if (
    group.operations?.canJoin.__typename === "GroupOperationValidationFailed"
  ) {
    return (
      <Button
        aria-label="Join"
        onClick={() => setShowJoinGroupModal(true, group)}
        outline
        size={small ? "sm" : "md"}
      >
        Join
      </Button>
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
      Join
    </Button>
  );
};

export default Join;
