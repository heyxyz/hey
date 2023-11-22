import type { ApolloCache } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import Slug from '@components/Shared/Slug';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { TokenHandleRegistry } from '@hey/abis';
import { TOKEN_HANDLE_REGISTRY } from '@hey/data/constants';
import type {
  LinkHandleToProfileRequest,
  UnlinkHandleFromProfileRequest
} from '@hey/lens';
import {
  useBroadcastOnchainMutation,
  useCreateLinkHandleToProfileTypedDataMutation,
  useCreateUnlinkHandleFromProfileTypedDataMutation,
  useLinkHandleToProfileMutation,
  useOwnedHandlesQuery,
  useUnlinkHandleFromProfileMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useState } from 'react';
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

  const [linkingOrUnlinkingHandle, setLinkingOrUnlinkingHandle] = useState<
    string | null
  >(null);

  const handleWrongNetwork = useHandleWrongNetwork();
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `ProfileOperations:$`,
      fields: {
        isBlockedByMe: (existingValue) => {
          // return { ...existingValue, value: !hasBlocked };
        }
      }
    });
  };

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setLinkingOrUnlinkingHandle(null);
    // setHasBlocked(!hasBlocked);
    // setShowBlockOrUnblockAlert(false, null);
    // toast.success(
    //   hasBlocked ? 'Blocked successfully!' : 'Unblocked successfully!'
    // );
    // Leafwatch.track(hasBlocked ? PROFILE.BLOCK : PROFILE.UNBLOCK, {
    //   profile_id: blockingorUnblockingProfile?.id
    // });
  };

  const onError = (error: any) => {
    setLinkingOrUnlinkingHandle(null);
    errorToast(error);
  };

  const { data, loading } = useOwnedHandlesQuery({
    variables: { request: { for: currentProfile?.ownedBy.address } }
  });

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: TOKEN_HANDLE_REGISTRY,
    abi: TokenHandleRegistry,
    functionName: 'setBlockStatus',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
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
  };

  const [createLinkHandleToProfileTypedData] =
    useCreateLinkHandleToProfileTypedDataMutation({
      onCompleted: async ({ createLinkHandleToProfileTypedData }) =>
        await typedDataGenerator(createLinkHandleToProfileTypedData),
      onError,
      update: updateCache
    });

  const [createUnlinkHandleFromProfileTypedData] =
    useCreateUnlinkHandleFromProfileTypedDataMutation({
      onCompleted: async ({ createUnlinkHandleFromProfileTypedData }) =>
        await typedDataGenerator(createUnlinkHandleFromProfileTypedData),
      onError,
      update: updateCache
    });

  const [linkHandleToProfile] = useLinkHandleToProfileMutation({
    onCompleted: ({ linkHandleToProfile }) =>
      onCompleted(linkHandleToProfile.__typename),
    onError,
    update: updateCache
  });

  const [unlinkHandleFromProfile] = useUnlinkHandleFromProfileMutation({
    onCompleted: ({ unlinkHandleFromProfile }) =>
      onCompleted(unlinkHandleFromProfile.__typename),
    onError,
    update: updateCache
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

  const unlinkHandleFromProfileViaLensManager = async (
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

  const linkOrUnlink = async (handle: string, link: boolean) => {
    if (!currentProfile) {
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setLinkingOrUnlinkingHandle(handle);
      const request:
        | LinkHandleToProfileRequest
        | UnlinkHandleFromProfileRequest = { handle };

      // Unlink
      if (link) {
        if (canUseLensManager) {
          return await unlinkHandleFromProfileViaLensManager(request);
        }

        return await createUnlinkHandleFromProfileTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request
          }
        });
      }

      // Link
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

  const ownedHandles = data?.ownedHandles.items;

  return (
    <div className="space-y-6">
      {ownedHandles?.map((handle) => (
        <div
          key={handle.fullHandle}
          className="flex items-center justify-between"
        >
          <Slug slug={handle.fullHandle} />
          <Button
            icon={
              linkingOrUnlinkingHandle === handle.fullHandle ? (
                <Spinner size="xs" />
              ) : handle.linkedTo ? (
                <MinusCircleIcon className="h-4 w-4" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )
            }
            onClick={() =>
              linkOrUnlink(handle.fullHandle, Boolean(handle.linkedTo))
            }
            disabled={linkingOrUnlinkingHandle === handle.fullHandle}
            outline
          >
            {handle.linkedTo ? 'Unlink' : 'Link'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
