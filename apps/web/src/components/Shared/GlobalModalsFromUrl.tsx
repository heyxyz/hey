import type { FC } from 'react';

import { AUTH } from '@hey/data/tracking';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import { useSignupStore } from './Auth/Signup';

const GlobalModalsFromUrl: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { setScreen } = useSignupStore();

  // Trigger Signup modal
  useEffect(() => {
    if (isReady && query?.signup && !currentProfile?.id) {
      setScreen('choose');
      setShowAuthModal(true, 'signup');
      Leafwatch.track(AUTH.OPEN_SIGNUP);

      // remove query param
      push({ pathname: '/' }, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return null;
};

export default GlobalModalsFromUrl;
