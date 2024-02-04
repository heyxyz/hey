import type { FC } from 'react';

import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const SignupButton: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <Button
      onClick={() => {
        setShowAuthModal(true, 'signup');
        Leafwatch.track(AUTH.SIGNUP);
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
