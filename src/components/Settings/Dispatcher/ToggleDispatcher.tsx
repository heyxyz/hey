import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { CreateSetDispatcherBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { CREATE_SET_DISPATCHER_TYPED_DATA_MUTATION } from '@gql/TypedAndDispatcherData/CreateSetDispatcher';
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import clsx from 'clsx';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  buttonVariant?: 'primary' | 'danger';
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<Props> = ({ buttonVariant = 'danger', buttonSize = 'md' }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    toast.success('Profile updated successfully!');
    // TODO: mixpanel track success
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      // TODO: mixpanel track error
    }
  });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      // TODO: mixpanel track broadcast_error
    }
  });

  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_SET_DISPATCHER_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createSetDispatcherTypedData
      }: {
        createSetDispatcherTypedData: CreateSetDispatcherBroadcastItemResult;
      }) => {
        const { id, typedData } = createSetDispatcherTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { profileId, dispatcher } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            dispatcher,
            sig
          };
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
        } catch (error) {}
      },
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;

  return writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} reload />
    </div>
  ) : (
    <Button
      variant={canUseRelay ? 'danger' : buttonVariant}
      className={clsx({ 'text-sm': buttonSize === 'sm' }, `mr-auto`)}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner variant={canUseRelay ? 'danger' : buttonVariant} size="xs" />
        ) : canUseRelay ? (
          <XIcon className="w-4 h-4" />
        ) : (
          <CheckCircleIcon className="w-4 h-4" />
        )
      }
      onClick={() => {
        createSetProfileMetadataTypedData({
          variables: {
            request: {
              profileId: currentProfile?.id,
              enable: canUseRelay ? false : true
            }
          }
        });
      }}
    >
      {canUseRelay ? 'Disable' : 'Enable'} dispatcher
    </Button>
  );
};

export default ToggleDispatcher;
