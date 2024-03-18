import type {
  AnyPublication,
  MomokaMirrorRequest,
  OnchainMirrorRequest
} from '@hey/lens';
import type { FC } from 'react';

import { useApolloClient } from '@apollo/client';
import { Menu } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENS_HUB } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import {
  TriStateValue,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnchainMutation,
  useMirrorOnMomokaMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import cn from '@hey/ui/cn';
import checkAndToastDispatcherError from '@lib/checkAndToastDispatcherError';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useCounter } from '@uidotdev/usehooks';
import { toast } from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useSignTypedData, useWriteContract } from 'wagmi';

interface MirrorProps {
  isLoading: boolean;
  publication: AnyPublication;
  setIsLoading: (isLoading: boolean) => void;
}

const Mirror: FC<MirrorProps> = ({ isLoading, publication, setIsLoading }) => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore(
    (state) => state
  );
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const { hasMirrored } = targetPublication.operations;

  const [shares, { increment }] = useCounter(
    targetPublication.stats.mirrors + targetPublication.stats.quotes
  );

  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = () => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasMirrored: true };
        }
      },
      id: cache.identify(targetPublication)
    });
    cache.modify({
      fields: { mirrors: () => shares + 1 },
      id: cache.identify(targetPublication.stats)
    });
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
      | 'RelayError'
      | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return onError();
    }

    setIsLoading(false);
    increment();
    updateCache();
    toast.success('Post has been mirrored!');
    Leafwatch.track(PUBLICATION.MIRROR, { publication_id: publication.id });
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
      },
      onSuccess: () => {
        onCompleted();
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: 'mirror'
    });
  };

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) =>
      onCompleted(broadcastOnMomoka.__typename),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  });

  const typedDataGenerator = async (
    generatedData: any,
    isMomokaPublication = false
  ) => {
    const { id, typedData } = generatedData;
    await handleWrongNetwork();

    if (canBroadcast) {
      const signature = await signTypedDataAsync(getSignature(typedData));
      if (isMomokaPublication) {
        return await broadcastOnMomoka({
          variables: { request: { id, signature } }
        });
      }
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        return await write({ args: [typedData.value] });
      }
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

      return;
    }

    return await write({ args: [typedData.value] });
  };

  // On-chain typed data generation
  const [createOnchainMirrorTypedData] =
    useCreateOnchainMirrorTypedDataMutation({
      onCompleted: async ({ createOnchainMirrorTypedData }) =>
        await typedDataGenerator(createOnchainMirrorTypedData),
      onError
    });

  // Momoka typed data generation
  const [createMomokaMirrorTypedData] = useCreateMomokaMirrorTypedDataMutation({
    onCompleted: async ({ createMomokaMirrorTypedData }) =>
      await typedDataGenerator(createMomokaMirrorTypedData, true),
    onError
  });

  // Onchain mutations
  const [mirrorOnchain] = useMirrorOnchainMutation({
    onCompleted: ({ mirrorOnchain }) => onCompleted(mirrorOnchain.__typename),
    onError
  });

  // Momoka mutations
  const [mirrorOnMomoka] = useMirrorOnMomokaMutation({
    onCompleted: ({ mirrorOnMomoka }) => onCompleted(mirrorOnMomoka.__typename),
    onError
  });

  if (targetPublication.operations.canMirror === TriStateValue.No) {
    return null;
  }

  const createOnMomka = async (request: MomokaMirrorRequest) => {
    const { data } = await mirrorOnMomoka({ variables: { request } });

    if (data?.mirrorOnMomoka?.__typename === 'LensProfileManagerRelayError') {
      const shouldProceed = checkAndToastDispatcherError(
        data.mirrorOnMomoka.reason
      );

      if (!shouldProceed) {
        return;
      }

      return await createMomokaMirrorTypedData({ variables: { request } });
    }
  };

  const createOnChain = async (request: OnchainMirrorRequest) => {
    const { data } = await mirrorOnchain({ variables: { request } });
    if (data?.mirrorOnchain.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    }
  };

  const createMirror = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const request: MomokaMirrorRequest | OnchainMirrorRequest = {
        mirrorOn: publication?.id
      };

      if (publication.momoka?.proof) {
        if (canUseLensManager) {
          return await createOnMomka(request);
        }

        return await createMomokaMirrorTypedData({ variables: { request } });
      }

      if (canUseLensManager) {
        return await createOnChain(request);
      }

      return await createOnchainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          hasMirrored ? 'text-green-500' : '',
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      disabled={isLoading}
      onClick={createMirror}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="size-4" />
        <div>{hasMirrored ? 'Mirror again' : 'Mirror'}</div>
      </div>
    </Menu.Item>
  );
};

export default Mirror;
