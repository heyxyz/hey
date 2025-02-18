import IndexStatus from "@components/Shared/IndexStatus";
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
import useTransactionLifecycle from "src/hooks/useTransactionHandler";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { Hex } from "viem";

interface ToggleLensManagerProps {
  buttonSize?: "sm";
}

const ToggleLensManager: FC<ToggleLensManagerProps> = ({
  buttonSize = "md"
}) => {
  const { isSignlessEnabled } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const { handleTransactionLifecycle } = useTransactionLifecycle();

  const onCompleted = (hash: string) => {
    setTxHash(hash as Hex);
    setIsLoading(false);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [enableSignless] = useEnableSignlessMutation({
    onCompleted: async ({ enableSignless }) => {
      await handleTransactionLifecycle({
        transactionData: enableSignless,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [removeSignless] = useRemoveSignlessMutation({
    onCompleted: async ({ removeSignless }) => {
      await handleTransactionLifecycle({
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

    setIsLoading(true);

    return isSignlessEnabled ? await removeSignless() : await enableSignless();
  };

  return txHash ? (
    <div className="mt-2">
      <IndexStatus shouldReload txHash={txHash} />
    </div>
  ) : (
    <Button
      className={cn({ "text-sm": buttonSize === "sm" }, "mr-auto")}
      disabled={isLoading}
      onClick={handleToggleDispatcher}
      variant={isSignlessEnabled ? "danger" : "primary"}
    >
      {isSignlessEnabled ? "Disable" : "Enable"}
    </Button>
  );
};

export default ToggleLensManager;
