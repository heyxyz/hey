import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import { LensterPublication } from '@generated/lenstertypes';
import { CreateMirrorBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import {
  CREATE_MIRROR_TYPED_DATA_MUTATION,
  CREATE_MIRROR_VIA_DISPATHCER_MUTATION
} from '@gql/TypedAndDispatcherData/CreateMirror';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import splitSignature from '@lib/splitSignature';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  publication: LensterPublication;
}

const Mirror: FC<Props> = ({ publication }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(PUBLICATION.MIRROR, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });

  const onCompleted = () => {
    setCount(count + 1);
    setMirrored(true);
    toast.success('Post has been mirrored!');
    Mixpanel.track(PUBLICATION.MIRROR, { result: 'success' });
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const [broadcast, { loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(PUBLICATION.MIRROR, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });

  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(
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
            } = await broadcast({ variables: { request: { id, signature } } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const [createMirrorViaDispatcher, { loading: dispatcherLoading }] = useMutation(
    CREATE_MIRROR_VIA_DISPATHCER_MUTATION,
    {
      onCompleted,
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
        Mixpanel.track(PUBLICATION.MIRROR, {
          result: 'dispatcher_error',
          error: error?.message
        });
      }
    }
  );

  const createMirror = () => {
    if (!isAuthenticated) {
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
              <SwitchHorizontalIcon className="w-[15px] sm:w-[18px]" />
            </Tooltip>
          )}
        </div>
        {count > 0 && <div className="text-[11px] sm:text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  );
};

export default Mirror;
