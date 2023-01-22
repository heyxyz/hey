import type { ApolloCache } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { UserAddIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import { LensHubProxy } from 'abis';
import { LENSHUB_PROXY } from 'data/constants';
import type { Profile } from 'lens';
import { useBroadcastMutation, useCreateFollowTypedDataMutation, useProxyActionMutation } from 'lens';
import { useRouter } from 'next/router';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { PROFILE } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

export enum FollowSource {
  WHO_TO_FOLLOW = 'who_to_follow',
  WHO_TO_FOLLOW_MODAL = 'who_to_follow_modal',
  LIKES_MODAL = 'likes_modal',
  MIRRORS_MODAL = 'mirrors_modal',
  COLLECTORS_MODAL = 'collectors_modal',
  FOLLOWERS_MODAL = 'followers_modal',
  FOLLOWING_MODAL = 'following_modal',
  MUTUAL_FOLLOWERS_MODAL = 'mutual_followers_modal',
  PUBLICATION_RELEVANT_PROFILES = 'publication_relevant_profiles',
  DIRECT_MESSAGE_HEADER = 'direct_message_header',
  PROFILE_PAGE = 'profile_page',
  PROFILE_POPOVER = 'profile_popover'
}

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;

  // For data analytics
  followPosition?: number;
  followSource?: string;
}

const Follow: FC<Props> = ({ profile, showText = false, setFollowing, followSource, followPosition }) => {
  const { pathname } = useRouter();
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    setFollowing(true);
    toast.success(t`Followed successfully!`);
    Analytics.track(PROFILE.FOLLOW, {
      follow_path: pathname,
      ...(followSource && { follow_source: followSource }),
      ...(followPosition && { follow_position: followPosition }),
      follow_from: currentProfile?.id,
      follow_target: profile?.id
    });
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
      await createFollowTypedData({
        variables: {
          request: { follow: [{ profile: profile?.id }] },
          options: { overrideSigNonce: userSigNonce }
        }
      });
    }
  };

  const createFollow = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (profile?.followModule) {
        await createFollowTypedData({
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
        await createViaProxyAction({
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
      aria-label="Follow"
      disabled={isLoading}
      icon={isLoading ? <Spinner size="xs" /> : <UserAddIcon className="w-4 h-4" />}
    >
      {showText && t`Follow`}
    </Button>
  );
};

export default Follow;
