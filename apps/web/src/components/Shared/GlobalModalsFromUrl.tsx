import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { AUTH } from '@hey/data/tracking';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import { useSignupStore } from './Auth/Signup';

const GlobalModalsFromUrl: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { setScreen } = useSignupStore();

  useEffect(() => {
    if (isReady && query.signup && !currentProfile?.id) {
      setScreen('choose');
      setShowAuthModal(true, 'signup');
      Leafwatch.track(AUTH.OPEN_SIGNUP);

      // Remove query param
      push({ pathname: '/' }, undefined, { shallow: true });
    }
  }, [isReady, query, currentProfile, setScreen, setShowAuthModal, push]);

  return null;
};

export default GlobalModalsFromUrl;
