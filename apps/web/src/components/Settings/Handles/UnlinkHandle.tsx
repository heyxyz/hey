import type { UnlinkHandleFromProfileRequest } from '@hey/lens';
import type { FC } from 'react';

import IndexStatus from '@components/Shared/IndexStatus';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { TokenHandleRegistry } from '@hey/abis';
import { Errors } from '@hey/data';
import { TOKEN_HANDLE_REGISTRY } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import checkDispatcherPermissions from '@hey/helpers/checkDispatcherPermissions';
import getSignature from '@hey/helpers/getSignature';
import {
  useBroadcastOnchainMutation,
  useCreateUnlinkHandleFromProfileTypedDataMutation,
  useUnlinkHandleFromProfileMutation
} from '@hey/lens';
import { Button, Spinner } from '@hey/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import errorToast from 'src/helpers/errorToast';
import { Leafwatch } from 'src/helpers/leafwatch';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useSignTypedData, useWriteContract } from 'wagmi';

const UnlinkHandle: FC = () => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const { incrementLensHubOnchainSigNonce, lensHubOnchainSigNonce } =
    useNonceStore();
  const [unlinking, setUnlinking] = useState<boolean>(false);

  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setUnlinking(false);
    toast.success('Handle unlinked successfully!');
    Leafwatch.track(SETTINGS.HANDLE.UNLINK);
  };

  const onError = (error: any) => {
    setUnlinking(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { data: writeHash, writeContractAsync } = useWriteContract({
    mutation: { onError, onSuccess: () => onCompleted() }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: TokenHandleRegistry,
      address: TOKEN_HANDLE_REGISTRY,
      args,
      functionName: 'unlink'
    });
  };

  const [broadcastOnchain, { data: broadcastData }] =
    useBroadcastOnchainMutation({
      onCompleted: ({ broadcastOnchain }) =>
        onCompleted(broadcastOnchain.__typename)
    });

  const [createUnlinkHandleFromProfileTypedData] =
    useCreateUnlinkHandleFromProfileTypedDataMutation({
      onCompleted: async ({ createUnlinkHandleFromProfileTypedData }) => {
        const { id, typedData } = createUnlinkHandleFromProfileTypedData;
        await handleWrongNetwork();

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args: [typedData.value] });
          }
          incrementLensHubOnchainSigNonce();

          return;
        }

        return await write({ args: [typedData.value] });
      },
      onError
    });

  const [unlinkHandleFromProfile, { data: linkHandleToProfileData }] =
    useUnlinkHandleFromProfileMutation({
      onCompleted: ({ unlinkHandleFromProfile }) =>
        onCompleted(unlinkHandleFromProfile.__typename),
      onError
    });

  const unlinkHandleToProfileViaLensManager = async (
    request: UnlinkHandleFromProfileRequest
  ) => {
    const { data } = await unlinkHandleFromProfile({ variables: { request } });

    if (
      data?.unlinkHandleFromProfile.__typename ===
      'LensProfileManagerRelayError'
    ) {
      return await createUnlinkHandleFromProfileTypedData({
        variables: { request }
      });
    }
  };

  const unlink = async () => {
    if (!currentProfile) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setUnlinking(true);
      const request: UnlinkHandleFromProfileRequest = {
        handle: currentProfile.handle?.fullHandle
      };

      if (canUseLensManager) {
        return await unlinkHandleToProfileViaLensManager(request);
      }

      return await createUnlinkHandleFromProfileTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const lensManegaerTxId =
    linkHandleToProfileData?.unlinkHandleFromProfile.__typename ===
      'RelaySuccess' && linkHandleToProfileData.unlinkHandleFromProfile.txId;
  const broadcastTxId =
    broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' &&
    broadcastData.broadcastOnchain.txId;

  return (
    <div className="m-5">
      {lensManegaerTxId || broadcastTxId || writeHash ? (
        <div className="mt-2">
          <IndexStatus
            reload
            txHash={writeHash}
            txId={lensManegaerTxId || broadcastTxId}
          />
        </div>
      ) : (
        <Button
          disabled={unlinking}
          icon={
            unlinking ? (
              <Spinner size="xs" />
            ) : (
              <MinusCircleIcon className="size-4" />
            )
          }
          onClick={unlink}
          outline
        >
          Un-link handle
        </Button>
      )}
    </div>
  );
};

export default UnlinkHandle;
