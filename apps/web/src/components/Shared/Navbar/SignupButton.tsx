import type { FC } from 'react';

import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import { useSignupStore } from '../Auth/Signup';

const SignupButton: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const setScreen = useSignupStore((state) => state.setScreen);

  return (
    <Button
      onClick={() => {
        setScreen('choose');
        setShowAuthModal(true, 'signup');
        Leafwatch.track(AUTH.OPEN_SIGNUP);
      }}
      outline
      size="md"
      variant="black"
    >
      Signup
    </Button>
  );
};

export default SignupButton;
