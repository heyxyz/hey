import { LensHubProxy } from '@abis/LensHubProxy';
import type { ApolloCache } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { Mutation, Profile } from '@generated/types';
import { CreateFollowTypedDataDocument, ProxyActionDocument } from '@generated/types';
import { UserAddIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
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
    Leafwatch.track(PROFILE.FOLLOW);
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

  const { broadcast, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreateFollowTypedDataDocument,
    {
      onCompleted: async ({ createFollowTypedData }) => {
        const { id, typedData } = createFollowTypedData;
        const { deadline } = typedData.value;

        try {
          const signature = await signTypedDataAsync(getSignature(typedData));
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

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }
        } catch {}
      },
      onError,
      update: updateCache
    }
  );

  const [createFollowProxyAction, { loading: proxyActionLoading }] = useMutation(ProxyActionDocument, {
    onCompleted,
    onError,
    update: updateCache
  });

  const createFollow = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
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
