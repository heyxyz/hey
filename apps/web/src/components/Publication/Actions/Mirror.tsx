import type { ApolloCache } from '@apollo/client';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterPublication } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import humanize from '@lib/humanize';
import { publicationKeyFields } from '@lib/keyFields';
import { Leafwatch } from '@lib/leafwatch';
import nFormatter from '@lib/nFormatter';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy } from 'abis';
import clsx from 'clsx';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'data/constants';
import { motion } from 'framer-motion';
import type { CreateDataAvailabilityMirrorViaDispatcherRequest, CreateMirrorRequest } from 'lens';
import {
  useCreateDataAvailabilityMirrorViaDispatcherMutation,
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const Mirror: FC<Props> = ({ publication, isFullPublication }) => {
  const isMirror = publication.__typename === 'Mirror';
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const [mirrored, setMirrored] = useState(
    publication?.mirrors?.length > 0 || publication?.mirrorOf?.mirrors?.length > 0
  );

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const updateCache = (cache: ApolloCache<any>) => {
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

  const onCompleted = () => {
    setMirrored(true);
    toast.success('Post has been mirrored!');
    Leafwatch.track(PUBLICATION.MIRROR);
  };

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast } = useBroadcast({ onCompleted, update: updateCache });
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

      setUserSigNonce(userSigNonce + 1);
      if (!RELAY_ON) {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }

      const {
        data: { broadcast: result }
      } = await broadcast({ request: { id, signature } });

      if ('reason' in result) {
        write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }
    },
    onError
  });

  const [createDataAvailabilityMirrorViaDispatcher] = useCreateDataAvailabilityMirrorViaDispatcherMutation({
    onCompleted,
    onError,
    update: updateCache
  });

  const [createMirrorViaDispatcher] = useCreateMirrorViaDispatcherMutation({
    onCompleted,
    onError,
    update: updateCache
  });

  const createViaDataAvailablityDispatcher = async (
    request: CreateDataAvailabilityMirrorViaDispatcherRequest
  ) => {
    await createDataAvailabilityMirrorViaDispatcher({
      variables: { request }
    });
  };

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const { data } = await createMirrorViaDispatcher({
      variables: { request }
    });
    if (data?.createMirrorViaDispatcher?.__typename === 'RelayError') {
      await createMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const createMirror = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    try {
      setIsSubmitting(true);
      const request = {
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

      if (currentProfile?.dispatcher?.canUseRelay) {
        if (publication.isDataAvailability) {
          await createViaDataAvailablityDispatcher(dataAvailablityRequest);
        } else {
          await createViaDispatcher(request);
        }
      } else {
        await createMirrorTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request
          }
        });
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createMirror}
      disabled={isSubmitting}
      aria-label="Mirror"
    >
      <span className={clsx(mirrored ? 'text-green-500' : 'text-brand', 'flex items-center space-x-1')}>
        <span
          className={clsx(
            mirrored ? 'hover:bg-green-300' : 'hover:bg-brand-300',
            'p-1.5 rounded-full hover:bg-opacity-20'
          )}
        >
          {isSubmitting ? (
            <Spinner variant={mirrored ? 'success' : 'primary'} size="xs" />
          ) : (
            <Tooltip placement="top" content={count > 0 ? `${humanize(count)} Mirrors` : 'Mirror'} withDelay>
              <SwitchHorizontalIcon className={iconClassName} />
            </Tooltip>
          )}
        </span>
        {count > 0 && !isFullPublication && (
          <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
        )}
      </span>
    </motion.button>
  );
};

export default Mirror;
