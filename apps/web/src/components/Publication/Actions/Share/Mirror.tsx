import { Menu } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import type {
  AnyPublication,
  MomokaMirrorRequest,
  OnchainMirrorRequest
} from '@hey/lens';
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
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useMirrorOrQuoteOptimisticStore } from 'src/store/OptimisticActions/useMirrorOrQuoteOptimisticStore';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface MirrorProps {
  publication: AnyPublication;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const Mirror: FC<MirrorProps> = ({ publication, setIsLoading, isLoading }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const getMirrorOrQuoteCountByPublicationId = useMirrorOrQuoteOptimisticStore(
    (state) => state.getMirrorOrQuoteCountByPublicationId
  );
  const hasQuotedOrMirroredByMe = useMirrorOrQuoteOptimisticStore(
    (state) => state.hasQuotedOrMirroredByMe
  );
  const setMirrorOrQuoteConfig = useMirrorOrQuoteOptimisticStore(
    (state) => state.setMirrorOrQuoteConfig
  );
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const handleWrongNetwork = useHandleWrongNetwork();

  const { isSponsored, canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const hasQuotedOrMirrored = hasQuotedOrMirroredByMe(targetPublication.id);
  const mirrorOrQuoteCount = getMirrorOrQuoteCountByPublicationId(
    targetPublication.id
  );

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'RelayError'
      | 'RelaySuccess'
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return onError();
    }

    setIsLoading(false);
    setMirrorOrQuoteConfig(targetPublication.id, {
      countMirrorOrQuote: mirrorOrQuoteCount + 1,
      mirroredOrQuoted: true
    });
    toast.success('Post has been mirrored!');
    Leafwatch.track(PUBLICATION.MIRROR, {
      publication_id: publication.id
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'mirror',
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    }
  });

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) =>
      onCompleted(broadcastOnMomoka.__typename),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const typedDataGenerator = async (
    generatedData: any,
    isMomokaPublication = false
  ) => {
    const { id, typedData } = generatedData;
    const signature = await signTypedDataAsync(getSignature(typedData));

    if (canBroadcast) {
      if (isMomokaPublication) {
        return await broadcastOnMomoka({
          variables: { request: { id, signature } }
        });
      }

      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
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

    if (handleWrongNetwork()) {
      return;
    }

    if (publication.momoka?.proof && !isSponsored) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      );
    }

    try {
      setIsLoading(true);
      const request: OnchainMirrorRequest | MomokaMirrorRequest = {
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
          hasQuotedOrMirrored ? 'text-green-500' : '',
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      onClick={createMirror}
      disabled={isLoading}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="h-4 w-4" />
        <div>{hasQuotedOrMirrored ? 'Mirrored' : 'Mirror'}</div>
      </div>
    </Menu.Item>
  );
};

export default Mirror;
