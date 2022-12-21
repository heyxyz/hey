import type { ApolloCache } from '@apollo/client';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import type { LensterPublication } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import humanize from '@lib/humanize';
import { publicationKeyFields } from '@lib/keyFields';
import nFormatter from '@lib/nFormatter';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy } from 'abis';
import clsx from 'clsx';
import { LENSHUB_PROXY, SIGN_WALLET } from 'data/constants';
import { motion } from 'framer-motion';
import type { CreateMirrorRequest } from 'lens';
import {
  useBroadcastMutation,
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
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const [mirrored, setMirrored] = useState(
    publication?.mirrors?.length > 0 || publication?.mirrorOf?.mirrors?.length > 0
  );

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

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
    Analytics.track(PUBLICATION.MIRROR);
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted,
    update: updateCache
  });

  const [createMirrorTypedData, { loading: typedDataLoading }] = useCreateMirrorTypedDataMutation({
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
      const { data } = await broadcast({ variables: { request: { id, signature } } });
      if (data?.broadcast.__typename === 'RelayError') {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }
    },
    onError
  });

  const [createMirrorViaDispatcher, { loading: dispatcherLoading }] = useCreateMirrorViaDispatcherMutation({
    onCompleted,
    onError,
    update: updateCache
  });

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const { data } = await createMirrorViaDispatcher({
      variables: { request }
    });
    if (data?.createMirrorViaDispatcher?.__typename === 'RelayError') {
      createMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const createMirror = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    try {
      const request = {
        profileId: currentProfile?.id,
        publicationId: publication?.id,
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        createViaDispatcher(request);
      } else {
        createMirrorTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request
          }
        });
      }
    } catch {}
  };

  const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={createMirror} disabled={isLoading} aria-label="Mirror">
      <span className={clsx(mirrored ? 'text-green-500' : 'text-brand', 'flex items-center space-x-1')}>
        <span
          className={clsx(
            mirrored ? 'hover:bg-green-300' : 'hover:bg-brand-300',
            'p-1.5 rounded-full hover:bg-opacity-20'
          )}
        >
          {isLoading ? (
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
