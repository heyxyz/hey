import { UserAddIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { LensHub } from 'abis';
import { Errors } from 'data';
import { LENSHUB_PROXY } from 'data/constants';
import type { Profile } from 'lens';
import {
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProxyActionMutation
} from 'lens';
import type { ApolloCache } from 'lens/apollo';
import getSignature from 'lib/getSignature';
import { useRouter } from 'next/router';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { useNonceStore } from 'src/store/nonce';
import { PROFILE } from 'src/tracking';
import { Button, Spinner } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface FollowProps {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  outline?: boolean;

  // For data analytics
  followPosition?: number;
  followSource?: string;
}

const Follow: FC<FollowProps> = ({
  profile,
  showText = false,
  setFollowing,
  outline = true,
  followSource,
  followPosition
}) => {
  const { pathname } = useRouter();
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const [isLoading, setIsLoading] = useState(false);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: {
        isFollowedByMe: () => true
      }
    });
  };

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    setFollowing(true);
    toast.success(t`Followed successfully!`);
    Mixpanel.track(PROFILE.FOLLOW, {
      follow_path: pathname,
      ...(followSource && { follow_source: followSource }),
      ...(followPosition && { follow_position: followPosition }),
      follow_target: profile?.id
    });
  };

  const onError = (error: any) => {
    if (
      error?.message?.includes('Usage limit exceeded, please try again later')
    ) {
      return;
    }

    setIsLoading(false);
    toast.error(
      error?.data?.message ?? error?.message ?? Errors.SomethingWentWrong
    );
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'follow',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { id, typedData } = createFollowTypedData;
      // TODO: Replace deep clone with right helper
      const signature = await signTypedDataAsync(
        getSignature(JSON.parse(JSON.stringify(typedData)))
      );
      setUserSigNonce(userSigNonce + 1);
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      });
      if (data?.broadcast.__typename === 'RelayError') {
        const { profileIds, datas } = typedData.value;
        return write?.({ args: [profileIds, datas] });
      }
    },
    onError,
    update: updateCache
  });

  const [createFollowProxyAction] = useProxyActionMutation({
    onCompleted: () => onCompleted(),
    onError,
    update: updateCache
  });

  const createViaProxyAction = async (variables: any) => {
    const { data } = await createFollowProxyAction({
      variables
    });
    if (!data?.proxyAction) {
      return await createFollowTypedData({
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
      setIsLoading(true);
      if (profile?.followModule) {
        return await createFollowTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: {
              follow: [
                {
                  profile: profile?.id,
                  followModule:
                    profile?.followModule?.__typename ===
                    'ProfileFollowModuleSettings'
                      ? {
                          profileFollowModule: { profileId: currentProfile?.id }
                        }
                      : null
                }
              ]
            }
          }
        });
      }

      return await createViaProxyAction({
        request: {
          follow: { freeFollow: { profileId: profile?.id } }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline={outline}
      onClick={createFollow}
      aria-label="Follow"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <UserAddIcon className="h-4 w-4" />
      }
    >
      {showText && t`Follow`}
    </Button>
  );
};

export default Follow;
