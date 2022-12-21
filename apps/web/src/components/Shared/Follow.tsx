import type { ApolloCache } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { UserAddIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy } from 'abis';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'data/constants';
import type { Profile } from 'lens';
import { useBroadcastMutation, useCreateFollowTypedDataMutation, useProxyActionMutation } from 'lens';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
}

const Follow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    setFollowing(true);
    toast.success('Followed successfully!');
    Analytics.track(PROFILE.FOLLOW);
  };

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: {
        isFollowedByMe: () => true
      }
    });
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({ onCompleted });
  const [createFollowTypedData, { loading: typedDataLoading }] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { id, typedData } = createFollowTypedData;
      const { deadline } = typedData.value;
      // TODO: Replace deep clone with right helper
      const signature = await signTypedDataAsync(getSignature(JSON.parse(JSON.stringify(typedData))));
      setUserSigNonce(userSigNonce + 1);
      const { profileIds, datas: followData } = typedData.value;
      const { v, r, s } = splitSignature(signature);
      const sig = { v, r, s, deadline };
      const inputStruct = {
        follower: address,
        profileIds,
        datas: followData,
        sig
      };
      if (!RELAY_ON) {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }

      const { data } = await broadcast({ variables: { request: { id, signature } } });
      if (data?.broadcast.__typename === 'RelayError') {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }
    },
    onError,
    update: updateCache
  });

  const [createFollowProxyAction, { loading: proxyActionLoading }] = useProxyActionMutation({
    onCompleted,
    onError,
    update: updateCache
  });

  const createViaProxyAction = async (variables: any) => {
    const { data } = await createFollowProxyAction({
      variables
    });
    if (!data?.proxyAction) {
      createFollowTypedData({
        variables: {
          request: { follow: [{ profile: profile?.id }] },
          options: { overrideSigNonce: userSigNonce }
        }
      });
    }
  };

  const createFollow = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    try {
      if (profile?.followModule) {
        createFollowTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: {
              follow: [
                {
                  profile: profile?.id,
                  followModule:
                    profile?.followModule?.__typename === 'ProfileFollowModuleSettings'
                      ? { profileFollowModule: { profileId: currentProfile?.id } }
                      : null
                }
              ]
            }
          }
        });
      } else {
        createViaProxyAction({
          request: {
            follow: {
              freeFollow: {
                profileId: profile?.id
              }
            }
          }
        });
      }
    } catch {}
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
