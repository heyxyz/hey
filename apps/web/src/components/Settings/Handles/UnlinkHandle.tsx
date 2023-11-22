import IndexStatus from '@components/Shared/IndexStatus';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { TokenHandleRegistry } from '@hey/abis';
import { TOKEN_HANDLE_REGISTRY } from '@hey/data/constants';
import type { UnlinkHandleFromProfileRequest } from '@hey/lens';
import {
  useBroadcastOnchainMutation,
  useCreateUnlinkHandleFromProfileTypedDataMutation,
  useUnlinkHandleFromProfileMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

const UnlinkHandle: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const [unlinking, setUnlinking] = useState<boolean>(false);

  const handleWrongNetwork = useHandleWrongNetwork();
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setUnlinking(false);
    toast.success('Handle unlinked successfully!');
    // setHasBlocked(!hasBlocked);
    // setShowBlockOrUnblockAlert(false, null);
    // Leafwatch.track(hasBlocked ? PROFILE.BLOCK : PROFILE.UNBLOCK, {
    //   profile_id: blockingorUnblockingProfile?.id
    // });
  };

  const onError = (error: any) => {
    setUnlinking(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write, data: writeData } = useContractWrite({
    address: TOKEN_HANDLE_REGISTRY,
    abi: TokenHandleRegistry,
    functionName: 'unlink',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain, { data: broadcastData }] =
    useBroadcastOnchainMutation({
      onCompleted: ({ broadcastOnchain }) =>
        onCompleted(broadcastOnchain.__typename)
    });

  const [createUnlinkHandleFromProfileTypedData] =
    useCreateUnlinkHandleFromProfileTypedDataMutation({
      onCompleted: async ({ createUnlinkHandleFromProfileTypedData }) => {
        const { id, typedData } = createUnlinkHandleFromProfileTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

        if (canBroadcast) {
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args: [typedData.value] });
          }
          return;
        }

        return write({ args: [typedData.value] });
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

    if (handleWrongNetwork()) {
      return;
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
  const writeHash = writeData?.hash;

  return (
    <div>
      {lensManegaerTxId || broadcastTxId || writeHash ? (
        <div className="mt-2">
          <IndexStatus
            txHash={writeHash}
            txId={lensManegaerTxId || broadcastTxId}
            reload
          />
        </div>
      ) : (
        <Button
          icon={
            unlinking ? (
              <Spinner size="xs" />
            ) : (
              <MinusCircleIcon className="h-4 w-4" />
            )
          }
          onClick={unlink}
          disabled={unlinking}
          outline
        >
          UnLink
        </Button>
      )}
    </div>
  );
};

export default UnlinkHandle;
