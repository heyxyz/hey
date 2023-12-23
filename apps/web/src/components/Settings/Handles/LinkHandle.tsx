import type { LinkHandleToProfileRequest } from '@hey/lens';
import type { FC } from 'react';

import IndexStatus from '@components/Shared/IndexStatus';
import Loader from '@components/Shared/Loader';
import Slug from '@components/Shared/Slug';
import {
  AtSymbolIcon,
  MinusCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { TokenHandleRegistry } from '@hey/abis';
import { TOKEN_HANDLE_REGISTRY } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateLinkHandleToProfileTypedDataMutation,
  useLinkHandleToProfileMutation,
  useOwnedHandlesQuery
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, EmptyState, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

const LinkHandle: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const [linkingHandle, setLinkingHandle] = useState<null | string>(null);

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

    setLinkingHandle(null);
    toast.success('Handle linked successfully!');
    Leafwatch.track(SETTINGS.HANDLE.LINK);
  };

  const onError = (error: any) => {
    setLinkingHandle(null);
    errorToast(error);
  };

  const { data, loading } = useOwnedHandlesQuery({
    variables: { request: { for: currentProfile?.ownedBy.address } }
  });

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { data: writeData, write } = useContractWrite({
    abi: TokenHandleRegistry,
    address: TOKEN_HANDLE_REGISTRY,
    functionName: 'link',
    onError,
    onSuccess: () => onCompleted()
  });

  const [broadcastOnchain, { data: broadcastData }] =
    useBroadcastOnchainMutation({
      onCompleted: ({ broadcastOnchain }) =>
        onCompleted(broadcastOnchain.__typename)
    });

  const [createLinkHandleToProfileTypedData] =
    useCreateLinkHandleToProfileTypedDataMutation({
      onCompleted: async ({ createLinkHandleToProfileTypedData }) => {
        const { id, typedData } = createLinkHandleToProfileTypedData;
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

  const [linkHandleToProfile, { data: linkHandleToProfileData }] =
    useLinkHandleToProfileMutation({
      onCompleted: ({ linkHandleToProfile }) =>
        onCompleted(linkHandleToProfile.__typename),
      onError
    });

  const linkHandleToProfileViaLensManager = async (
    request: LinkHandleToProfileRequest
  ) => {
    const { data } = await linkHandleToProfile({ variables: { request } });

    if (
      data?.linkHandleToProfile.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createLinkHandleToProfileTypedData({
        variables: { request }
      });
    }
  };

  const link = async (handle: string) => {
    if (!currentProfile) {
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setLinkingHandle(handle);
      const request: LinkHandleToProfileRequest = { handle };

      if (canUseLensManager) {
        return await linkHandleToProfileViaLensManager(request);
      }

      return await createLinkHandleToProfileTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const ownedHandles = data?.ownedHandles.items.filter(
    (handle) => !handle.linkedTo
  );

  if (!ownedHandles?.length) {
    return (
      <EmptyState
        hideCard
        icon={<AtSymbolIcon className="text-brand-500 size-8" />}
        message="No handles found to link!"
      />
    );
  }

  const lensManegaerTxId =
    linkHandleToProfileData?.linkHandleToProfile.__typename ===
      'RelaySuccess' && linkHandleToProfileData.linkHandleToProfile.txId;
  const broadcastTxId =
    broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' &&
    broadcastData.broadcastOnchain.txId;
  const writeHash = writeData?.hash;

  return (
    <div className="space-y-6">
      {ownedHandles?.map((handle) => (
        <div
          className="flex items-center justify-between"
          key={handle.fullHandle}
        >
          <Slug className="font-bold" slug={handle.fullHandle} />
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
              disabled={linkingHandle === handle.fullHandle}
              icon={
                linkingHandle === handle.fullHandle ? (
                  <Spinner size="xs" />
                ) : handle.linkedTo ? (
                  <MinusCircleIcon className="size-4" />
                ) : (
                  <PlusCircleIcon className="size-4" />
                )
              }
              onClick={() => link(handle.fullHandle)}
              outline
            >
              Link
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
