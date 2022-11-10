import { useLazyQuery, useMutation } from '@apollo/client';
import { Modal } from '@components/UI/Modal';
import { ProfilesDocument } from '@generated/types';
import { AuthenticateDocument, ChallengeDocument } from '@generated/types';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';
import { useAccount, useSignMessage } from 'wagmi';

import AuthModal from './AuthModal';
import LoginButton from './LoginButton';

const Login = () => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  const { address } = useAccount();

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message);
    setLoading(false);
  };

  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useLazyQuery(ChallengeDocument, {
    fetchPolicy: 'no-cache',
    onError
  });
  const [authenticate, { error: errorAuthenticate }] = useMutation(AuthenticateDocument);
  const [getProfiles, { error: errorProfiles }] = useLazyQuery(ProfilesDocument, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (errorAuthenticate?.message || errorChallenge?.message || errorProfiles?.message) {
      toast.error(
        errorAuthenticate?.message || errorChallenge?.message || errorProfiles?.message || ERROR_MESSAGE
      );
    }
  }, [errorAuthenticate, errorChallenge, errorProfiles]);

  const handleSign = async () => {
    try {
      setLoading(true);
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });
      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERROR_MESSAGE);
      }
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });
      const result = await authenticate({
        variables: { request: { address, signature } }
      });
      const accessToken = result.data?.authenticate.accessToken;
      const refreshToken = result.data?.authenticate.refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const { data: profilesData } = await getProfiles({
        variables: { request: { ownedBy: [address] } }
      });
      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
      Leafwatch.track(USER.SIWL);
    } catch (error) {
      toast.error('Failed to signin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginButton handleSign={handleSign} signing={loading} />
      <Modal
        title="Login"
        icon={<ArrowCircleRightIcon className="h-5 w-5 text-brand" />}
        onClose={() => setHasProfile(true)}
        show={!hasProfile}
      >
        <AuthModal />
      </Modal>
    </>
  );
};

export default Login;
