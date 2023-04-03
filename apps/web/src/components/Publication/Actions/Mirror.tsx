import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import { LensHub } from 'abis';
import clsx from 'clsx';
import { LENSHUB_PROXY } from 'data/constants';
import Errors from 'data/errors';
import { motion } from 'framer-motion';
import type { CreateMirrorRequest, Publication } from 'lens';
import {
  useBroadcastMutation,
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from 'lens';
import type { ApolloCache } from 'lens/apollo';
import { publicationKeyFields } from 'lens/apollo/lib';
import getSignature from 'lib/getSignature';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { Spinner, Tooltip } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface MirrorProps {
  publication: Publication;
  showCount: boolean;
}

const Mirror: FC<MirrorProps> = ({ publication, showCount }) => {
  const isMirror = publication.__typename === 'Mirror';
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const [mirrored, setMirrored] = useState(
    // @ts-ignore
    isMirror ? publication?.mirrorOf?.mirrors?.length > 0 : publication?.mirrors?.length > 0
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

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setMirrored(true);
    toast.success(t`Post has been mirrored!`);
    Mixpanel.track(PUBLICATION.MIRROR);
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename),
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
    onCompleted: ({ createMirrorViaDispatcher }) => onCompleted(createMirrorViaDispatcher.__typename),
    onError,
    update: updateCache
  });

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

    try {
      const request: CreateMirrorRequest = {
        profileId: currentProfile?.id,
        publicationId: publication?.id,
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        return await createViaDispatcher(request);
      }

      return await createMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    } catch {}
  };

  const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <div className={clsx(mirrored ? 'text-green-500' : 'text-brand', 'flex items-center space-x-1')}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={createMirror}
        disabled={isLoading}
        aria-label="Mirror"
      >
        <div
          className={clsx(
            mirrored ? 'hover:bg-green-300' : 'hover:bg-brand-300',
            'rounded-full p-1.5 hover:bg-opacity-20'
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
      {count > 0 && !showCount && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
    </div>
  );
};

export default Mirror;
