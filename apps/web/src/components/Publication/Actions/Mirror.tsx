import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import { LensHub } from 'abis';
import clsx from 'clsx';
import { LENSHUB_PROXY } from 'data/constants';
import Errors from 'data/errors';
import { motion } from 'framer-motion';
import type {
  CreateDataAvailabilityMirrorRequest,
  CreateMirrorRequest,
  Publication
} from 'lens';
import {
  useBroadcastMutation,
  useCreateDataAvailabilityMirrorViaDispatcherMutation,
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from 'lens';
import { useApolloClient } from 'lens/apollo';
import { publicationKeyFields } from 'lens/apollo/lib';
import getSignature from 'lib/getSignature';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { PUBLICATION } from 'src/tracking';
import { Spinner, Tooltip } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface MirrorProps {
  publication: Publication;
  showCount: boolean;
}

const Mirror: FC<MirrorProps> = ({ publication, showCount }) => {
  const isMirror = publication.__typename === 'Mirror';
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const [mirrored, setMirrored] = useState(
    isMirror
      ? publication?.mirrorOf?.mirrors?.length > 0
      : // @ts-ignore
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
    Mixpanel.track(PUBLICATION.MIRROR);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    toast.error(
      error?.data?.message ?? error?.message ?? Errors.SomethingWentWrong
    );
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
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
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData,
        deadline
      } = typedData.value;
      const signature = await signTypedDataAsync(getSignature(typedData));
      const { v, r, s } = splitSignature(signature);
      const sig = { v, r, s, deadline };
      const inputStruct = {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData,
        sig
      };
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      });
      if (data?.broadcast.__typename === 'RelayError') {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
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

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div
      className={clsx(
        mirrored ? 'text-green-500' : 'text-brand',
        'flex items-center space-x-1'
      )}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={createMirror}
        disabled={isLoading}
        aria-label="Mirror"
      >
        <div
          className={clsx(
            mirrored ? 'hover:bg-green-300/20' : 'hover:bg-brand-300/20',
            'rounded-full p-1.5'
          )}
        >
          {isLoading ? (
            <Spinner variant={mirrored ? 'success' : 'primary'} size="xs" />
          ) : (
            <Tooltip
              placement="top"
              content={count > 0 ? t`${humanize(count)} Mirrors` : t`Mirror`}
              withDelay
            >
              <SwitchHorizontalIcon className={iconClassName} />
            </Tooltip>
          )}
        </div>
      </motion.button>
      {count > 0 && !showCount && (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      )}
    </div>
  );
};

export default Mirror;
