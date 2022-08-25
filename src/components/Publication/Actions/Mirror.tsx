import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { LensterPublication } from '@generated/lenstertypes';
import { CreateMirrorBroadcastItemResult, Mutation } from '@generated/types';
import {
  CREATE_MIRROR_TYPED_DATA_MUTATION,
  CREATE_MIRROR_VIA_DISPATHCER_MUTATION
} from '@gql/TypedAndDispatcherData/CreateMirror';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const Mirror: FC<Props> = ({ publication, isFullPublication }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [count, setCount] = useState(0);
  const [mirrored, setMirrored] = useState(
    publication?.mirrors?.length > 0 || publication?.mirrorOf?.mirrors?.length > 0
  );

  useEffect(() => {
    if (publication?.mirrorOf?.stats?.totalAmountOfMirrors || publication?.stats?.totalAmountOfMirrors) {
      setCount(
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
          : publication?.stats?.totalAmountOfMirrors
      );
    }
  }, [publication]);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    setCount(count + 1);
    setMirrored(true);
    toast.success('Post has been mirrored!');
    Mixpanel.track(PUBLICATION.MIRROR);
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CREATE_MIRROR_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createMirrorTypedData
      }: {
        createMirrorTypedData: CreateMirrorBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createMirrorTypedData;
          const {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            deadline
          } = typedData?.value;
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
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ request: { id, signature } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createMirrorViaDispatcher, { loading: dispatcherLoading }] = useMutation(
    CREATE_MIRROR_VIA_DISPATHCER_MUTATION,
    { onCompleted, onError }
  );

  const createMirror = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    const request = {
      profileId: currentProfile?.id,
      publicationId: publication?.id,
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createMirrorViaDispatcher({ variables: { request } });
    } else {
      createMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={createMirror} disabled={isLoading} aria-label="Mirror">
      <div className={clsx(mirrored ? 'text-green-500' : 'text-brand', 'flex items-center space-x-1')}>
        <div
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
        </div>
        {count > 0 && !isFullPublication && <div className="text-[11px] sm:text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  );
};

export default Mirror;
