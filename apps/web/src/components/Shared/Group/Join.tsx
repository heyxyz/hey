import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { type Group, useJoinGroupMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

interface JoinProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
  label?: string;
  className?: string;
}

const Join: FC<JoinProps> = ({
  group,
  setJoined,
  small,
  className = "",
  label = "Join"
}) => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const updateCache = () => {
    cache.modify({
      fields: { operations: () => true },
      id: cache.identify(group)
    });
  };

  const onCompleted = () => {
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
        return onCompleted();
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

  return (
    <Button
      aria-label="Join"
      className={className}
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      {label}
    </Button>
  );
};

export default Join;
