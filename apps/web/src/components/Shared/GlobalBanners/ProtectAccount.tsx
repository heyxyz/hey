import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { LockOpenIcon } from "@heroicons/react/24/outline";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import { Button, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useWriteContract } from "wagmi";
import CountdownTimer from "../CountdownTimer";
import IndexStatus from "../IndexStatus";

const ProtectAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    errorToast(error);
  };

  const {
    data: writeHash,
    isPending,
    writeContractAsync
  } = useWriteContract({
    mutation: {
      onError,
      onSuccess: () => Leafwatch.track(SETTINGS.DANGER.PROTECT_PROFILE)
    }
  });

  const write = async () => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      functionName: "enableTokenGuardian"
    });
  };

  if (!currentAccount?.guardian || currentAccount?.guardian?.protected) {
    return null;
  }

  const coolOffDate = new Date(currentAccount?.guardian?.cooldownEndsOn);
  const coolOffTime = new Date(
    coolOffDate.getTime() + 5 * 60 * 100
  ).toISOString();
  const isCoolOffPassed = new Date(coolOffDate).getTime() < Date.now();

  const handleProtect = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    try {
      await handleWrongNetwork();
      return await write();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="border-gray-300 border-b bg-gray-500/20">
      <GridLayout>
        <GridItemEight className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-700">
            <LockOpenIcon className="size-5" />
            <div className="font-bold text-base sm:text-lg">
              Attention! Your profile is currently unlocked.
            </div>
          </div>
          <div className="text-gray-500">
            {isCoolOffPassed ? (
              <>
                Your profile protection disabled.
                <Link
                  className="ml-1.5 underline"
                  href="https://github.com/lens-protocol/LIPs/blob/main/LIPs/lip-4.md"
                  target="_blank"
                >
                  Learn more
                </Link>
              </>
            ) : (
              <>
                Your profile protection disabling has been triggered. It will
                take effect in{" "}
                <b>
                  <CountdownTimer targetDate={coolOffTime} />
                </b>
              </>
            )}
          </div>
        </GridItemEight>
        <GridItemFour className="mt-5 flex items-center sm:mt-0 sm:ml-auto">
          {writeHash ? (
            <IndexStatus shouldReload txHash={writeHash} />
          ) : (
            <Button disabled={isPending} onClick={handleProtect}>
              Protect now
            </Button>
          )}
        </GridItemFour>
      </GridLayout>
    </div>
  );
};

export default ProtectAccount;
