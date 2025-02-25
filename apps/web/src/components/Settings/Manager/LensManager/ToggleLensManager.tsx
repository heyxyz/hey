import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  useEnableSignlessMutation,
  useRemoveSignlessMutation
} from "@hey/indexer";
import { Button } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface ToggleLensManagerProps {
  buttonSize?: "sm";
}

const ToggleLensManager: FC<ToggleLensManagerProps> = ({
  buttonSize = "md"
}) => {
  const { isSignlessEnabled } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [loading, setLoading] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setLoading(false);
    toast.success("Signless enabled");
  };

  const onError = (error: any) => {
    setLoading(false);
    errorToast(error);
  };

  const [enableSignless] = useEnableSignlessMutation({
    onCompleted: async ({ enableSignless }) => {
      return await handleTransactionLifecycle({
        transactionData: enableSignless,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [removeSignless] = useRemoveSignlessMutation({
    onCompleted: async ({ removeSignless }) => {
      return await handleTransactionLifecycle({
        transactionData: removeSignless,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleToggleDispatcher = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setLoading(true);

    return isSignlessEnabled ? await removeSignless() : await enableSignless();
  };

  return (
    <Button
      className={cn({ "text-sm": buttonSize === "sm" }, "mr-auto")}
      disabled={loading}
      onClick={handleToggleDispatcher}
      variant={isSignlessEnabled ? "danger" : "primary"}
    >
      {isSignlessEnabled ? "Disable" : "Enable"}
    </Button>
  );
};

export default ToggleLensManager;
