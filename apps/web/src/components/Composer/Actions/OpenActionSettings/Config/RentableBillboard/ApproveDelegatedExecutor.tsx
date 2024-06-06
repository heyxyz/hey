import type { Dispatch, FC, SetStateAction } from 'react';

import Loader from '@components/Shared/Loader';
import { LensHub } from '@good/abis';
import { Errors } from '@good/data';
import { LENS_HUB } from '@good/data/constants';
import { VerifiedOpenActionModules } from '@good/data/verified-openaction-modules';
import { Button } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransaction, useWriteContract } from 'wagmi';

interface ApproveDelegatedExecutorProps {
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

const ApproveDelegatedExecutor: FC<ApproveDelegatedExecutorProps> = ({
  setShowForm
}) => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();
  const { decrementLensHubOnchainSigNonce, incrementLensHubOnchainSigNonce } =
    useNonceStore();
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleWrongNetwork = useHandleWrongNetwork();

  const onCompleted = () => {
    setIsLoading(false);
    toast.success('Manager added successfully!');
    // Leafwatch.track(SETTINGS.MANAGER.ADD_MANAGER);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: (hash: string) => {
        setTransactionHash(hash as `0x${string}`);
        onCompleted();
        incrementLensHubOnchainSigNonce();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    await handleWrongNetwork();

    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: 'changeDelegatedExecutorsConfig'
    });
  };

  const { isSuccess } = useTransaction({
    hash: transactionHash as `0x${string}`,
    query: { enabled: Boolean(transactionHash) }
  });

  const addManager = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      return await write({
        args: [
          currentProfile?.id,
          [VerifiedOpenActionModules.RentableBillboard],
          [true],
          0,
          false
        ]
      });
    } catch (error) {
      onError(error);
    }
  };

  useEffect(() => {
    if (transactionHash && isSuccess) {
      setShowForm(true);
    }
  }, [isSuccess, setShowForm, transactionHash]);

  if (transactionHash && !isSuccess) {
    return <Loader className="my-10" message="Adding manager..." />;
  }

  return (
    <div className="m-5 space-y-5 text-center">
      <div>
        You need to approve the delegated executor one time to enable an
        auto-mirror whenever an advertiser acts on the post, for more visibility
        on the ad.
      </div>
      <Button disabled={isLoading} onClick={addManager}>
        Approve Delegated Executor
      </Button>
    </div>
  );
};

export default ApproveDelegatedExecutor;
