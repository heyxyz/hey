import IndexStatus from "@components/Shared/IndexStatus";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const UnlinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [unlinking, setUnlinking] = useState<boolean>(false);

  const onError = (error: any) => {
    setUnlinking(false);
    errorToast(error);
  };

  const handleUnlink = async () => {
    if (!currentAccount) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setUnlinking(true);
      const request: UnlinkHandleFromProfileRequest = {
        handle: currentAccount.username?.value
      };

      return await createUnlinkHandleFromProfileTypedData({
        variables: { request }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="m-5">
      {writeHash ? (
        <div className="mt-2">
          <IndexStatus shouldReload txHash={writeHash} />
        </div>
      ) : (
        <Button disabled={unlinking} onClick={handleUnlink} outline>
          Un-link handle
        </Button>
      )}
    </div>
  );
};

export default UnlinkHandle;
