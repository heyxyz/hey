import type { ActOnOpenActionLensManagerRequest } from '@hey/lens';
import type { Address } from 'viem';

import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import {
  useActOnOpenActionMutation,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useSignTypedData, useWriteContract } from 'wagmi';

interface CreatePublicationProps {
  onCompleted: (status?: any) => void;
  onError: (error: any) => void;
  signlessApproved?: boolean;
}

const useActOnUnknownOpenAction = ({
  onCompleted,
  onError,
  signlessApproved = false
}: CreatePublicationProps) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { writeContract } = useWriteContract({
    mutation: {
      onError: (error) => {
        onError(error);
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
      },
      onSuccess: () => {
        onCompleted();
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      }
    }
  });

  const write = ({ args }: { args: any }) => {
    return writeContract({
      abi: LensHub,
      address: LENSHUB_PROXY,
      args,
      functionName: 'act'
    });
  };

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData;

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args: [typedData.value] });
          }
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

          return;
        }

        return write({ args: [typedData.value] });
      },
      onError
    });

  // Act
  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) =>
      onCompleted(actOnOpenAction.__typename),
    onError
  });

  // Act via Lens Manager
  const actViaLensManager = async (
    request: ActOnOpenActionLensManagerRequest
  ) => {
    const { data, errors } = await actOnOpenAction({ variables: { request } });

    if (errors?.toString().includes('has already acted on')) {
      return;
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } });
    }
  };

  const actOnUnknownOpenAction = async ({
    address,
    data,
    publicationId
  }: {
    address: Address;
    data: string;
    publicationId: string;
  }) => {
    const actOnRequest: ActOnOpenActionLensManagerRequest = {
      actOn: { unknownOpenAction: { address, data } },
      for: publicationId
    };

    if (canUseLensManager && signlessApproved) {
      return await actViaLensManager(actOnRequest);
    }

    return await createActOnOpenActionTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: actOnRequest
      }
    });
  };

  return { actOnUnknownOpenAction };
};

export default useActOnUnknownOpenAction;
