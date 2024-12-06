import IndexStatus from "@components/Shared/IndexStatus";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  useEnableSignlessMutation,
  useRemoveSignlessMutation
} from "@hey/indexer";
import { Button } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface ToggleLensManagerProps {
  buttonSize?: "sm";
}

const ToggleLensManager: FC<ToggleLensManagerProps> = ({
  buttonSize = "md"
}) => {
  const { isSignlessEnabled } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const { data: walletClient } = useWalletClient();

  const onCompleted = (hash: string) => {
    setTxHash(hash as `0x${string}`);
    setIsLoading(false);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [enableSignless] = useEnableSignlessMutation({
    onCompleted: async ({ enableSignless }) => {
      if (walletClient) {
        try {
          if (enableSignless.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(enableSignless.raw)
            });

            return onCompleted(hash);
          }

          if (enableSignless.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(enableSignless.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (enableSignless.__typename === "TransactionWillFail") {
        return toast.error(enableSignless.reason);
      }
    },
    onError
  });

  const [removeSignless] = useRemoveSignlessMutation({
    onCompleted: async ({ removeSignless }) => {
      if (walletClient) {
        try {
          if (removeSignless.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(removeSignless.raw)
            });

            return onCompleted(hash);
          }

          if (removeSignless.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(removeSignless.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (removeSignless.__typename === "TransactionWillFail") {
        return toast.error(removeSignless.reason);
      }
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
