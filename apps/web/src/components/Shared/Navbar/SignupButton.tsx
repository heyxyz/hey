import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import { useSignupStore } from '../Auth/Signup';

const SignupButton: FC = () => {
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { setScreen } = useSignupStore();

  return (
    <Button
      onClick={() => {
        setScreen('choose');
        setShowAuthModal(true, 'signup');
        Leafwatch.track(AUTH.OPEN_SIGNUP);
      }}
      outline
      size="md"
    >
      Signup
    </Button>
  );
};

export default SignupButton;
