import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { Spinner } from '@components/UI/Spinner';
import { CreateSetDispatcherBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { CREATE_SET_DISPATCHER_TYPED_DATA_MUTATION } from '@gql/TypedAndDispatcherData/CreateSetDispatcher';
import { CheckCircleIcon, HandIcon } from '@heroicons/react/outline';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON, RELAYER_ADDRESS } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useContractWrite, useSignTypedData } from 'wagmi';

const EnableDispatcher: FC = () => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const canUseRelay = useAppStore((state) => state.canUseRelay);
  const currentUser = useAppPersistStore((state) => state.currentUser);

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

  if (canUseRelay) {
    return null;
  }

  const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;

  return (
    <Card className="mb-4 bg-red-50 dark:bg-red-900 !border-red-600">
      <CardBody className="space-y-2.5 text-red-600">
        <div className="flex items-center space-x-2 font-bold">
          <HandIcon className="w-5 h-5" />
          <p>Set dispatcher</p>
        </div>
        <p className="text-sm leading-[22px]">
          We suggest you to use dispatcher so you don't want to sign all your transactions.
        </p>
        {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
          <div className="mt-2">
            <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} reload />
          </div>
        ) : (
          <Button
            variant="danger"
            size="md"
            className="text-sm mr-auto"
            disabled={isLoading}
            icon={
              isLoading ? <Spinner variant="danger" size="xs" /> : <CheckCircleIcon className="w-4 h-4" />
            }
            onClick={() => {
              createSetProfileMetadataTypedData({
                variables: {
                  request: {
                    profileId: currentUser?.id,
                    dispatcher: RELAYER_ADDRESS,
                    enable: true
                  }
                }
              });
            }}
          >
            Enable dispatcher
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default EnableDispatcher;
