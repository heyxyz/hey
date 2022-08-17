import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { Community } from '@generated/lenstertypes';
import { CreateCollectBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { PlusIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import React, { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { COMMUNITY } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($options: TypedDataOptions, $request: CreateCollectRequest!) {
    createCollectTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

interface Props {
  community: Community;
  setJoined: Dispatch<boolean>;
  showJoin?: boolean;
}

const Join: FC<Props> = ({ community, setJoined, showJoin = true }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(COMMUNITY.JOIN, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });

  const onCompleted = () => {
    setJoined(true);
    toast.success('Joined successfully!');
    Mixpanel.track(COMMUNITY.JOIN, { result: 'success' });
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'collectWithSig',
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
      Mixpanel.track(COMMUNITY.JOIN, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });

  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult;
      }) => {
        const { id, typedData } = createCollectTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { profileId, pubId, data: collectData } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            collector: address,
            profileId,
            pubId,
            data: collectData,
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

  const createCollect = () => {
    if (!isAuthenticated) {
      return toast.error(SIGN_WALLET);
    }

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { publicationId: community.id }
      }
    });
  };

  return (
    <Button
      onClick={createCollect}
      disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
      icon={
        typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
          <Spinner variant="success" size="xs" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )
      }
      variant="success"
      outline
    >
      {showJoin && 'Join'}
    </Button>
  );
};

export default Join;
