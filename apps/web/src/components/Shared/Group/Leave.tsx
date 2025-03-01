import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type GroupFragment,
  type LoggedInGroupOperationsFragment,
  useLeaveGroupMutation
} from "@hey/indexer";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

interface LeaveProps {
  group: GroupFragment;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ group, setJoined, small }) => {
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isMember: () => false },
      id: cache.identify(group.operations as LoggedInGroupOperationsFragment)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setJoined(false);
    trackEvent(Events.Group.Leave);
    toast.success("Left group");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [leaveGroup] = useLeaveGroupMutation({
    onCompleted: async ({ leaveGroup }) => {
      if (leaveGroup.__typename === "LeaveGroupResponse") {
        return onCompleted();
      }

      if (leaveGroup.__typename === "GroupOperationValidationFailed") {
        return onError({ message: leaveGroup.reason });
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

    setIsSubmitting(true);

    return await leaveGroup({
      variables: { request: { group: group.address } }
    });
  };

  return (
    <Button
      aria-label="Leave"
      disabled={isSubmitting}
      onClick={handleLeave}
      size={small ? "sm" : "md"}
    >
      Leave
    </Button>
  );
};

export default Leave;
