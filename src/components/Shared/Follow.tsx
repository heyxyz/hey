import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { CreateFollowBroadcastItemResult, Profile } from '@generated/types';
import { PROXY_ACTION_MUTATION } from '@gql/ProxyAction';
import { UserAddIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Mixpanel } from '@lib/mixpanel';
import splitSignature from '@lib/splitSignature';
import { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { CONNECT_WALLET, ERROR_MESSAGE, LENSHUB_PROXY, RELAY_ON } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

const CREATE_FOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateFollowTypedData($options: TypedDataOptions, $request: FollowRequest!) {
    createFollowTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`;

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
}

const Follow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const { address } = useAccount();

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(PROFILE.FOLLOW, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });

  const onCompleted = () => {
    setFollowing(true);
    toast.success('Followed successfully!');
    Mixpanel.track(PROFILE.FOLLOW, { result: 'success' });
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    trackingString: PROFILE.FOLLOW,
    onCompleted
  });

  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createFollowTypedData
      }: {
        createFollowTypedData: CreateFollowBroadcastItemResult;
      }) => {
        const { id, typedData } = createFollowTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync(getSignature(typedData));
          setUserSigNonce(userSigNonce + 1);
          const { profileIds, datas: followData } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            follower: address,
            profileIds,
            datas: followData,
            sig
          };
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
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const [createFollowProxyAction, { loading: proxyActionLoading }] = useMutation(PROXY_ACTION_MUTATION, {
    onCompleted,
    onError: (error) => {
      toast.error(error.message ?? ERROR_MESSAGE);
      Mixpanel.track(PROFILE.FOLLOW, {
        result: 'proxy_action_error',
        error: error?.message
      });
    }
  });

  const createFollow = () => {
    if (!isConnected) {
      return toast.error(CONNECT_WALLET);
    }

    if (profile?.followModule) {
      createFollowTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: {
            follow: {
              profile: profile?.id,
              followModule:
                profile?.followModule?.__typename === 'ProfileFollowModuleSettings'
                  ? { profileFollowModule: { profileId: currentProfile?.id } }
                  : null
            }
          }
        }
      });
    } else {
      createFollowProxyAction({
        variables: {
          request: {
            follow: {
              freeFollow: {
                profileId: profile?.id
              }
            }
          }
        }
      });
    }
  };

  const isLoading = typedDataLoading || proxyActionLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createFollow}
      variant="success"
      aria-label="Follow"
      disabled={isLoading}
      icon={isLoading ? <Spinner variant="success" size="xs" /> : <UserAddIcon className="w-4 h-4" />}
    >
      {showText && 'Follow'}
    </Button>
  );
};

export default Follow;
