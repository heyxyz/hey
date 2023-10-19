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
  useBroadcastOnchainMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnchainMutation
} from '@hey/lens';
import getSignature from '@hey/lib/getSignature';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { useMirrorOrQuoteStore } from 'src/store/OptimisticActions/useMirrorOrQuoteStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface MirrorProps {
  publication: AnyPublication;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const Mirror: FC<MirrorProps> = ({ publication, setIsLoading, isLoading }) => {
  const {
    getMirrorOrQuoteCountByPublicationId,
    hasQuotedOrMirroredByMe,
    setMirrorOrQuoteConfig
  } = useMirrorOrQuoteStore();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const handleWrongNetwork = useHandleWrongNetwork();

  // Lens manager
  const canUseRelay = currentProfile?.lensManager;
  const isSponsored = currentProfile?.sponsor;

  const hasQuotedOrMirrored = hasQuotedOrMirroredByMe(targetPublication.id);
  const mirrorOrQuoteCount = getMirrorOrQuoteCountByPublicationId(
    targetPublication.id
  );

  const onCompleted = (
    __typename?:
      | 'RelayError'
      | 'RelaySuccess'
      | 'LensProfileManagerRelayError'
      | 'CreateMomokaMirrorBroadcastItemResult'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
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

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'mirror',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const [createOnchainMirrorTypedData] =
    useCreateOnchainMirrorTypedDataMutation({
      onCompleted: async ({ createOnchainMirrorTypedData }) => {
        const { id, typedData } = createOnchainMirrorTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
      onError
    });

  const [createMomokaMirrorTypedData] = useCreateMomokaMirrorTypedDataMutation({
    onCompleted: ({ createMomokaMirrorTypedData }) =>
      onCompleted(createMomokaMirrorTypedData.__typename),
    onError
  });

  const [mirrorOnchain] = useMirrorOnchainMutation({
    onCompleted: ({ mirrorOnchain }) => onCompleted(mirrorOnchain.__typename),
    onError
  });

  if (targetPublication.operations.canMirror === 'NO') {
    return null;
  }

  const createViaMomoka = async (request: MomokaMirrorRequest) => {
    await createMomokaMirrorTypedData({
      variables: { request }
    });
  };

  const createOnChain = async (request: OnchainMirrorRequest) => {
    const { data } = await mirrorOnchain({
      variables: { request }
    });

    if (data?.mirrorOnchain.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
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
      const request: OnchainMirrorRequest = {
        mirrorOn: publication?.id
      };

      // Payload for the data availability mirror
      const dataAvailablityRequest: MomokaMirrorRequest = {
        mirrorOn: publication?.id
      };

      if (canUseRelay) {
        if (publication.momoka?.proof && isSponsored) {
          return await createViaMomoka(dataAvailablityRequest);
        }

        return await createOnChain(request);
      }

      return await createOnchainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
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
