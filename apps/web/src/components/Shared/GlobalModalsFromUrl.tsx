import { AUTH } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import { useSignupStore } from './Auth/Signup';

const GlobalModalsFromUrl: FC = () => {
  const { isReady, query } = useRouter();
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const setScreen = useSignupStore((state) => state.setScreen);

  // Trigger Signup modal
  useEffect(() => {
    //query?.signup
    if (isReady && query?.signup) {
      setScreen('choose');
      setShowAuthModal(true, 'signup');
      Leafwatch.track(AUTH.OPEN_SIGNUP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return null;
};

export default GlobalModalsFromUrl;
