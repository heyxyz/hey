import { Menu } from '@headlessui/react';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { Errors, LENSHUB_PROXY } from '@lenster/data';
import type {
  CreateDataAvailabilityMirrorRequest,
  CreateMirrorRequest,
  Publication
} from '@lenster/lens';
import {
  useBroadcastMutation,
  useCreateDataAvailabilityMirrorViaDispatcherMutation,
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from '@lenster/lens';
import { useApolloClient } from '@lenster/lens/apollo';
import { publicationKeyFields } from '@lenster/lens/apollo/lib';
import getSignature from '@lenster/lib/getSignature';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { PUBLICATION } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface DeleteProps {
  publication: Publication;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const Mirror: FC<DeleteProps> = ({ publication, setIsLoading, isLoading }) => {
  const isMirror = publication.__typename === 'Mirror';
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [mirrored, setMirrored] = useState(
    isMirror
      ? publication?.mirrorOf?.mirrors?.length > 0
      : // @ts-expect-error
        publication?.mirrors?.length > 0
  );
  const { cache } = useApolloClient();

  // Dispatcher
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const updateCache = () => {
    cache.modify({
      id: publicationKeyFields(isMirror ? publication?.mirrorOf : publication),
      fields: {
        mirrors: (mirrors) => [...mirrors, currentProfile?.id],
        stats: (stats) => ({
          ...stats,
          totalAmountOfMirrors: stats.totalAmountOfMirrors + 1
        })
      }
    });
  };

  const onCompleted = (
    __typename?:
      | 'RelayError'
      | 'RelayerResult'
      | 'CreateDataAvailabilityPublicationResult'
  ) => {
    if (__typename === 'RelayError') {
      return;
    }

    updateCache();
    setIsLoading(false);
    setMirrored(true);
    toast.success(t`Post has been mirrored!`);
    Leafwatch.track(PUBLICATION.MIRROR);
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

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });

  const [createMirrorTypedData] = useCreateMirrorTypedDataMutation({
    onCompleted: async ({ createMirrorTypedData }) => {
      const { id, typedData } = createMirrorTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      });
      if (data?.broadcast.__typename === 'RelayError') {
        return write?.({ args: [typedData.value] });
      }
    },
    onError
  });

  const [createDataAvailabilityMirrorViaDispatcher] =
    useCreateDataAvailabilityMirrorViaDispatcherMutation({
      onCompleted: ({ createDataAvailabilityMirrorViaDispatcher }) =>
        onCompleted(createDataAvailabilityMirrorViaDispatcher.__typename),
      onError
    });

  const [createMirrorViaDispatcher] = useCreateMirrorViaDispatcherMutation({
    onCompleted: ({ createMirrorViaDispatcher }) =>
      onCompleted(createMirrorViaDispatcher.__typename),
    onError
  });

  const createViaDataAvailablityDispatcher = async (
    request: CreateDataAvailabilityMirrorRequest
  ) => {
    await createDataAvailabilityMirrorViaDispatcher({
      variables: { request }
    });
  };

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const { data } = await createMirrorViaDispatcher({
      variables: { request }
    });

    if (data?.createMirrorViaDispatcher.__typename === 'RelayError') {
      return await createMirrorTypedData({
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

    if (publication.isDataAvailability && !isSponsored) {
      return toast.error(
        t`Momoka is currently in beta - during this time certain actions are not available to all profiles.`
      );
    }

    try {
      setIsLoading(true);
      const request: CreateMirrorRequest = {
        profileId: currentProfile?.id,
        publicationId: publication?.id,
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };

      // Payload for the data availability mirror
      const dataAvailablityRequest = {
        from: currentProfile?.id,
        mirror: publication?.id
      };

      if (canUseRelay) {
        if (publication.isDataAvailability && isSponsored) {
          return await createViaDataAvailablityDispatcher(
            dataAvailablityRequest
          );
        }

        return await createViaDispatcher(request);
      }

      return await createMirrorTypedData({
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
        clsx(
          { 'dropdown-active': active },
          mirrored ? 'text-green-500' : '',
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      onClick={createMirror}
      disabled={isLoading}
    >
      <div className="flex items-center space-x-2">
        <SwitchHorizontalIcon className="h-4 w-4" />
        <div>{mirrored ? <Trans>Unmirror</Trans> : <Trans>Mirror</Trans>}</div>
      </div>
    </Menu.Item>
  );
};

export default Mirror;
