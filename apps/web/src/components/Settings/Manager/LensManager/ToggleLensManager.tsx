import IndexStatus from "@components/Shared/IndexStatus";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import { Button } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useWriteContract } from "wagmi";

interface ToggleLensManagerProps {
  buttonSize?: "sm";
}

const ToggleLensManager: FC<ToggleLensManagerProps> = ({
  buttonSize = "md"
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canUseSignless } = checkDispatcherPermissions(currentAccount);

  const onCompleted = (__typename?: "RelayError" | "RelaySuccess") => {
    if (__typename === "RelayError") {
      return;
    }

    setIsLoading(false);
    toast.success("Profile updated");
    Leafwatch.track(SETTINGS.MANAGER.TOGGLE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data: writeHash, writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: () => onCompleted()
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "changeDelegatedExecutorsConfig"
    });
  };

  const handleToggleDispatcher = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      return await createChangeProfileManagersTypedData({
        variables: {
          request: { approveSignless: !canUseSignless }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const broadcastTxId =
    broadcastData?.broadcastOnchain.__typename === "RelaySuccess" &&
    broadcastData.broadcastOnchain.txId;

  return writeHash || broadcastTxId ? (
    <div className="mt-2">
      <IndexStatus shouldReload txHash={writeHash} txId={broadcastTxId} />
    </div>
  ) : (
    <Button
      className={cn({ "text-sm": buttonSize === "sm" }, "mr-auto")}
      disabled={isLoading}
      onClick={handleToggleDispatcher}
      variant={canUseSignless ? "danger" : "primary"}
    >
      {canUseSignless ? "Disable" : "Enable"}
    </Button>
  );
};

export default ToggleLensManager;
