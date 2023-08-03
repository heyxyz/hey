import { Errors } from '@lenster/data/errors';
import type { Profile } from '@lenster/lens';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery
} from '@lenster/lens';
import { t } from '@lingui/macro';
import { useRouter } from 'next/router';
import { type FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import useAuthPersistStore, { signIn, signOut } from 'src/store/auth';
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi';

import ConnectWalletButton from './ConnectWalletButton';

const Login: FC = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const { disconnect } = useDisconnect();

  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfiles = useAppStore((state) => state.setProfiles);
  const profileId = useAuthPersistStore((state) => state.profileId);
  const setProfileId = useAuthPersistStore((state) => state.setProfileId);

  const onError = () => {
    setLoading(false);
    signOut();
    setCurrentProfile(null);
    setProfileId(null);
  };

  const { signMessageAsync } = useSignMessage({
    onError
  });

  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache',
    onError
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery({
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (
      errorAuthenticate?.message ??
      errorChallenge?.message ??
      errorProfiles?.message
    ) {
      toast.error(
        errorAuthenticate?.message ??
          errorChallenge?.message ??
          errorProfiles?.message ??
          Errors.SomethingWentWrong
      );
    }
  }, [errorAuthenticate, errorChallenge, errorProfiles]);

  const isReadyToSign =
    connector?.id &&
    isConnected &&
    chain?.id === CHAIN_ID &&
    !currentProfile &&
    !profileId;

  const handleSign = useCallback(async () => {
    if (!isReadyToSign) {
      disconnect?.();
      signOut();
      return toast.error(t`Please connect to your wallet`);
    }

    try {
      setLoading(true);
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });
      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });
      if (!signature) {
        return toast.error(t`Invalid Signature!`);
      }
      const result = await authenticate({
        variables: { request: { address, signature } }
      });
      const accessToken = result.data?.authenticate.accessToken;
      const refreshToken = result.data?.authenticate.refreshToken;
      signIn({ accessToken, refreshToken });
      const { data: profilesData } = await getProfiles({
        variables: { request: { ownedBy: [address] } }
      });

      if (
        !profilesData?.profiles ||
        profilesData?.profiles?.items.length === 0
      ) {
        setCurrentProfile(null);
        setProfileId(null);
      } else {
        const profiles = profilesData?.profiles?.items as Profile[];
        const defaultProfile = profiles.find((profile) => profile.isDefault);
        setProfiles(profiles);
        setCurrentProfile(defaultProfile ?? profiles[0]);
        setProfileId(defaultProfile?.id ?? profiles[0].id);
        if (router.query?.next) {
          router.push(router.query?.next as string);
        }
      }
      setLoading(false);
    } catch (error) {
      signOut();
      setLoading(false);
      toast.error(t`Sign in failed`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    authenticate,
    getProfiles,
    loadChallenge,
    router,
    setProfiles,
    setCurrentProfile,
    setProfileId,
    signMessageAsync
  ]);

  useEffect(() => {
    if (isReadyToSign) {
      handleSign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
  );
};

export default Login;
